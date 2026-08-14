// Reanimated's babel plugin is configured automatically by babel-preset-expo in
// SDK 54, and it already includes the worklets plugin -- adding
// react-native-worklets/plugin here as well raises "Duplicate plugin/preset
// detected". jsxImportSource is what lets className reach the interop layer.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
