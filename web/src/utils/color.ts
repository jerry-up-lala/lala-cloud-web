export const colorData = [
  'green',
  'cyan',
  'blue',
  'arcoblue',
  'purple',
  'pinkpurple',
  'magenta',
  'red',
  'orangered',
  'orange',
  'gold',
  'lime',
  'gray',
];

export const randomColor = (index: number): string => {
  if (index === -1) {
    index = 0;
  }
  return colorData[index ?? 0 % colorData.length];
};
