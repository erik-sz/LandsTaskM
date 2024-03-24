// services/taskService.js
import { supabase } from '../utils/supabase';
import { getUserId } from './authService';
import { fetchWeatherData } from './weatherService';

// Fetch all tasks from the server based on the company ID and return an array of tasks
export const fetchTasks = async () => {
  try {
    const companyId = await fetchCompanyId();
    if (!companyId) {
      console.error('Error fetching company ID: Company ID not found');
      return [];
    }

    let { data: tasks, error } = await supabase.from('tasks').select('*').eq('company_id', companyId);
    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }

    // Now check and potentially update weather data for fetched tasks
    tasks = await checkAndUpdateWeatherForTasks(tasks);
    
    console.log("Tasks fetched and updated (if necessary) with latest weather data.");
    return tasks;
  } catch (error) {
    console.error('Error in fetchTasks:', error);
    return [];
  }
};

// Create a new task on the server and return the created task object or null if the creation fails
export const createTask = async (task) => {
  const { data, error } = await supabase.from('tasks').insert([task], { returning: 'minimal' });

  if (error) {
    console.error('Error creating task:', error);
    return null;
  }
  return data;
};

// Fetch tha company ID from teh profiles table based on the user ID and return the company ID
export const fetchCompanyId = async () => {
    const userId = await getUserId();
    const { data, error } = await supabase.from('profiles').select('company_id').eq('id', userId);
    if (error) {
      console.error('Error fetching company ID:', error);
    }
    return data[0].company_id;
};

// Fetch a single task from the server based on the task ID and return the task object or an error
export const fetchTaskById = async (taskId) => {
  const { data, error } = await supabase.from('tasks').select('*').eq('task_id', taskId).single();
  if (error) {
    throw error;
  }
	console.log("Task details: ", data.title, data.description, data.status, data.due_date, data.company_id);

  return data;
};

// Update a task on the server and return the updated task object or an error if the update fails
export const updateTask = async (task) => {
  const { data, error } = await supabase.from('tasks').update({ ...task }).eq('task_id', task.task_id);
  if (error) {
    throw error;
  }
  return data;
};

// Delete a task from the server and return the deleted task object or an error if the delete fails
export const deleteTask = async (taskId) => {
	const { data, error } = await supabase.from('tasks').delete().eq('task_id', taskId);
	if (error) {
		throw error;
	}
	return data;
};

// Function to fetch geolocation by task ID and return the geolocation object or null if not found
export const fetchGeolocationByTaskId = async (taskId) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('location')
      .eq('task_id', taskId)
      .single();

    if (error) {
      console.error('Error fetching task:', error);
      return null;
    }

    // Check if the task has location data
    if (data && data.location) {
      const locationObj = JSON.parse(data.location);
      // Extract the geometry.location part of the location data
      const geolocation = locationObj.geometry.location;
      console.log('Geolocation:', geolocation);

      return geolocation;
    } else {
      console.log('No location data available for this task.');
      return null;
    }
  } catch (error) {
    console.error('Error processing the geolocation:', error);
    return null;
  }
};

export const checkAndUpdateWeatherForTasks = async (tasks) => {
  const tasksToUpdate = [];
  const currentTime = new Date().getTime();
  
  for (const task of tasks) {
    console.log(`Checking task ${task.task_id} for weather update...`);
    
    // Convert last_updated to milliseconds for comparison
    const lastUpdatedTime = new Date(task.last_updated).getTime();
    const isOutdated = (currentTime - lastUpdatedTime) > 6 * 60 * 60 * 1000; // 6 hours buffer for weather data update

    if (isOutdated) {
      console.log(`Task ${task.task_id} weather data is outdated. Fetching new data...`);
      if (task.location && task.location.geometry) {
        const lat = task.location.geometry.location.lat;
        const lon = task.location.geometry.location.lng;

        try {
          const newWeatherData = await fetchWeatherData(lat, lon);
          task.weather = newWeatherData;
          task.last_updated = new Date().toISOString();
          tasksToUpdate.push(task);
        } catch (error) {
          console.error(`Failed to fetch new weather data for task ${task.task_id}:`, error);
        }
      }
    }
  }

  // Update tasks with new weather data in the database
  if (tasksToUpdate.length > 0) {
    console.log(`Updating ${tasksToUpdate.length} tasks with new weather data...`);
    await updateTasksWithNewWeatherData(tasksToUpdate);
  } else {
    console.log("No tasks require weather data updates.");
  }

  return tasks; // Return tasks, which now include updated weather data and last_updated timestamps
};

// Update tasks with new weather data in the database
const updateTasksWithNewWeatherData = async (tasksToUpdate) => {
  for (const task of tasksToUpdate) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ weather: task.weather })
      .eq('task_id', task.task_id);

    if (error) {
      console.error('Error updating task with new weather data:', task.task_id, error);
    } else {
      console.log('Task updated with new weather data:', data);
    }
  }
};
  