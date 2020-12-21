import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#312E38',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  input: {
    backgroundColor: '#232129',
    height: 60,
    alignSelf: 'stretch',
    paddingHorizontal: 24,
    borderRadius: 8,
    fontSize: 16,
    marginTop: 24,
    color: '#f4ede8',
  },
  button: {
    backgroundColor: '#df4723',
    height: 60,
    alignSelf: 'stretch',
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    color: '#fff',   
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default styles;