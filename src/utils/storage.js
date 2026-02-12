import { supabase } from './supabase'

// Convert a Supabase goal row + entries into the app's goal shape
function toGoal(row, entries = []) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    target: row.target != null ? Number(row.target) : null,
    unit: row.unit || '',
    startValue: row.start_value != null ? Number(row.start_value) : null,
    visibility: row.visibility,
    createdAt: row.created_at,
    entries: entries.map((e) => ({
      id: e.id,
      value: Number(e.value),
      date: e.date,
      createdAt: e.created_at,
    })),
  }
}

export async function getGoals(username) {
  const { data: goals, error } = await supabase
    .from('goals')
    .select('*, entries(*)')
    .eq('username', username)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching goals:', error)
    return []
  }

  return goals.map((g) => toGoal(g, g.entries || []))
}

export async function getAllPublicGoals() {
  const { data: goals, error } = await supabase
    .from('goals')
    .select('*, entries(*)')
    .eq('visibility', 'public')

  if (error) {
    console.error('Error fetching public goals:', error)
    return []
  }

  return goals.map((g) => ({ ...toGoal(g, g.entries || []), username: g.username }))
}

export async function getAllGoalNames() {
  const { data, error } = await supabase
    .from('goals')
    .select('name')

  if (error) {
    console.error('Error fetching goal names:', error)
    return []
  }

  const names = new Set(data.map((g) => g.name))
  return [...names].sort((a, b) => a.localeCompare(b))
}

export async function saveGoal(username, goal) {
  // Upsert the goal row
  const { error: goalError } = await supabase
    .from('goals')
    .upsert({
      id: goal.id,
      username,
      name: goal.name,
      type: goal.type,
      target: goal.target,
      unit: goal.unit,
      start_value: goal.startValue,
      visibility: goal.visibility,
      created_at: goal.createdAt,
    })

  if (goalError) {
    console.error('Error saving goal:', goalError)
    return
  }

  // Sync entries: get existing entry IDs, insert only new ones
  const { data: existingEntries } = await supabase
    .from('entries')
    .select('id')
    .eq('goal_id', goal.id)

  const existingIds = new Set((existingEntries || []).map((e) => e.id))
  const newEntries = goal.entries.filter((e) => !existingIds.has(e.id))

  if (newEntries.length > 0) {
    const { error: entryError } = await supabase
      .from('entries')
      .insert(newEntries.map((e) => ({
        id: e.id,
        goal_id: goal.id,
        value: e.value,
        date: e.date,
        created_at: e.createdAt,
      })))

    if (entryError) {
      console.error('Error saving entries:', entryError)
    }
  }
}

export async function deleteGoal(username, goalId) {
  // Entries cascade-delete via FK
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)
    .eq('username', username)

  if (error) {
    console.error('Error deleting goal:', error)
  }
}
