import axios from 'axios';

/* SELECTORS */
export const getOne = ({singleItem}) => singleItem.data;

/* action name creator */
const reducerName = 'singleItem';
const createActionName = name => `app/${reducerName}/${name}`;

/* action types */
const START_REQUEST = createActionName('START_REQUEST');
const END_REQUEST = createActionName('END_REQUEST');
const ERROR_REQUEST = createActionName('ERROR_REQUEST');
const LOAD_ONE = createActionName('LOAD_ONE');

/* action creators */
export const startRequest = payload => ({ payload, type: START_REQUEST });
export const endRequest = payload => ({ payload, type: END_REQUEST });
export const errorRequest = payload => ({ payload, type: ERROR_REQUEST });
export const loadOne = payload => ({ payload, type: LOAD_ONE });

export const fetchOneItem = () => {

  return async dispatch => {
    dispatch(startRequest());

    try {
      const url = window.location.pathname.split('/');
      const [ category, name ] = url.slice(-2);
      const res = await axios.get(`https://swapi.dev/api/${category}`);
      const item = await res.data.results.filter(el => (el.name || el.title) === name.replaceAll('-', ' '));

      dispatch(loadOne(item[0]));
      dispatch(endRequest());

    } catch(e) {
      dispatch(errorRequest(e.message));
    }
  };
};

// reducer
export default function reducer(statePart = [], action = {}) {
  switch (action.type) {
    case LOAD_ONE: {
      return {
        ...statePart,
        data: {...action.payload},
      }
    }
    case START_REQUEST:
      return { ...statePart, request: { pending: true, error: null, success: false } };
    case END_REQUEST:
      return { ...statePart, request: { pending: false, error: null, success: true } };
    case ERROR_REQUEST:
      return { ...statePart, request: { pending: false, error: action.error, success: false } };
    default:
      return statePart;
  }
}
