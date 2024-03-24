// services/api.js
import { supabase } from '../utils/supabase';

// Update the user profile with the isManager flag in the profile table and return the updated profile object
export const updateUserProfileWithIsManagerFlag = async (userId, isManager) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_manager: isManager, updated_at: new Date() }, { returning: 'minimal' })
    .match({ id: userId });

  if (error) {
    throw error;
  }
  // console to show the user profile has been updated with the isManager flag in the profile table as true
  console.log("User profile updated with isManager flag: ", data, "at: ", new Date(), "\n");
  return data;
}

// Create a new company with the provided name and return the company object from the server
export const createCompany = async (companyName) => {
  const { error: insertError } = await supabase
    .from('companies')
    .insert([{ name: companyName }]);

  if (insertError) {
    console.error('Error creating company:', insertError.message);
    throw new Error('Problem creating the company: ' + insertError.message);
  }

  // Fetch the recently inserted company based on the company name
  const { data: fetchedData, error: fetchError } = await supabase
    .from('companies')
    .select()
    .eq('name', companyName)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (fetchError) {
    console.error('Error fetching the recently created company:', fetchError.message);
    throw new Error('Problem fetching the recently created company: ' + fetchError.message);
  }

  if (!fetchedData) {
    console.error('No data returned after fetching the recently created company');
    throw new Error('No data returned after fetching the recently created company');
  }

  console.log("Recently created company fetched successfully: ", fetchedData, "at: ", new Date(), "\n");
  return fetchedData;
};

// Update the user profile with the company_id in the profile table and return the updated profile object
export const updateUserProfileWithCompanyId = async (userId, companyId) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ company_id: companyId, updated_at: new Date() })
    .match({ id: userId });

  if (error) {
    console.error("Error updating user profile with company ID:", error.message);
    throw error;
  }

  console.log("User profile updated with company_id: ", data, "at: ", new Date(), "\n");
  return data;
};

// Create the user's name from their email by splitting the email at the '@' symbol and returning the first part
export const getUserNameFromEmail = async (email) => {
  const username = email.split('@')[0];
  // console to show the user name has been created from the email
  console.log("User name created from email: ", username, "at: ", new Date(), "\n");
  return username;
}
