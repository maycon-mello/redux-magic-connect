import { connect } from 'react-redux';

let store;

function reduceState(state, type, ...args) {
  const namespaces = type.split('/');
  if (store.getters && store.getters[type]) {
    const nsState = namespaces.slice(0, -1).reduce((result, prop) => result[prop], state);
    return store.getters[type](nsState, ...args);
  }

  return namespaces.reduce((result, prop) => result && result[prop], state);
}

export function setStore(item) {
  store = item;
}

export const mapStateToProps = optionFn => (state, props) => {
  const dispatch = () => false;
  const get = (type, ...args) => reduceState(state, type, ...args);

  return optionFn({
    dispatch,
    get,
    props,
  }).properties || {};
};

export const mapDispatchToProps = optionFn => (dispatch, props) => {
  const customDispatch = (type, payload) => dispatch({ type, ...payload });
  const get = () => false;
  const result = optionFn({
    dispatch: customDispatch,
    get: get,
    props: props,
  });
  if (result.init) {
    result.init();
  }
  return result.methods || {};
};

export default optionFunction => connect(() => mapStateToProps(optionFunction), () => mapDispatchToProps(optionFunction));
