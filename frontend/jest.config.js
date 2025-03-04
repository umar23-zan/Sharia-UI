module.exports = {
  
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js"
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
 
};