module.exports = {
  root: true,
  extends: ['custom'],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@avila-tek/ui/src', './packages/ui/src']],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    },
  },
};
