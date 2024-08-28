import { supabase } from '../supabase'

export const saveDesign = async (userId: string, designData: any) => {
  const { data, error } = await supabase
    .from('saved_designs')
    .insert({ user_id: userId, design_data: designData })

  if (error) throw error
  return data
}

export const getDesignHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('design_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const shareDesign = async (designId: string) => {
  // Generate a unique shareable link
  const shareableLink = `${window.location.origin}/shared-design/${designId}`
  
  // You might want to store this link in your database as well
  
  return shareableLink
}