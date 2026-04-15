let toastCallbacks = [];

export function showToast(message, type = 'info') {
  const id = Date.now();
  const toast = { id, message, type };
  
  toastCallbacks.forEach(callback => callback(toast));
  
  return id;
}

export function subscribeToToasts(callback) {
  toastCallbacks.push(callback);
  
  return () => {
    toastCallbacks = toastCallbacks.filter(cb => cb !== callback);
  };
}
