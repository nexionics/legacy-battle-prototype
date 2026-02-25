module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@/app': './src/app',
            '@/modules': './src/modules',
            '@/shared': './src/shared',
          },
        },
      ],
    ],
  };
};
