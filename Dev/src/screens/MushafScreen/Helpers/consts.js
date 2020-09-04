export const noAyahSelected = {
  surah: 0,
  page: 0,
  ayah: 0
};

export const noSelection = {
  start: noAyahSelected,
  end: noAyahSelected,
  started: false,
  completed: false
};

export const isNoSelection = selection => {
  return JSON.stringify(selection) === JSON.stringify(noSelection);
};
