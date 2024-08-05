import _ from "lodash";

export function updateKey(
  obj: { [key: string]: any },
  oldKey: string,
  newKey: string
) {
  // Check if the old key exists in the object
  if (!_.has(obj, oldKey)) {
    return obj; // Return the original object if the old key does not exist
  }

  const value = obj[oldKey];
  const newObject = _.omit(obj, oldKey); // Create a new object without the old key
  return { ...newObject, [newKey]: value }; // Add the new key with its value
}
