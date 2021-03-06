import axios from 'axios';
import { API_URL } from '../config';

/* SELECTORS */
export const getAllFilters = ({filters}) => filters;
export const getSearchedItem = ({filters}) => filters.searchedItem;
export const getAllData = ({data}) => data;

/* ACTIONS */

// action name creator
const reducerName = 'filters';
const createActionName = name => `app/${reducerName}/${name}`;

// action types
const START_REQUEST = createActionName('START_REQUEST');
const END_REQUEST = createActionName('END_REQUEST');
const ERROR_REQUEST = createActionName('ERROR_REQUEST');
const GET_ITEM = createActionName('GET_ITEM');

// action creators
export const startRequest = () => ({ type: START_REQUEST });
export const endRequest = () => ({ type: END_REQUEST });
export const errorRequest = error => ({ error, type: ERROR_REQUEST });
export const getItem = payload => ({ payload, type: GET_ITEM });

/* thunk creators */
export const fetchSearchedItem = (input) => {

  return async dispatch => {
    dispatch(startRequest({ name: 'GET_ITEM' }));

    try {
      const clearInput = input.toLowerCase();

      const people = axios.get(`${API_URL}/people/?search=${clearInput}`);
      const films = axios.get(`${API_URL}/films/?search=${clearInput}`);
      const species = axios.get(`${API_URL}/species/?search=${clearInput}`);
      const planets = axios.get(`${API_URL}/planets/?search=${clearInput}`);
      const vehicles = axios.get(`${API_URL}/vehicles/?search=${clearInput}`);
      const starships = axios.get(`${API_URL}/starships/?search=${clearInput}`);

      await axios
        .all([people, films, species, planets, vehicles, starships])
        .then(
          axios.spread((people, vehicles, species, planets, films, starships ) => {
          const results = [...people.data.results, ...films.data.results, ...planets.data.results, ...species.data.results, ...starships.data.results, ...vehicles.data.results]
          dispatch(getItem(results));
        }))

      dispatch(endRequest({ name: 'GET_ITEM' }));

    } catch(e) {
      dispatch(errorRequest(e.message));
    }
  };
};

// reducer
export default function reducer(statePart = [], action = {}) {
  switch (action.type) {
      case GET_ITEM:
        return {
          ...statePart,
          searchedItem: [...action.payload],
        };
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
