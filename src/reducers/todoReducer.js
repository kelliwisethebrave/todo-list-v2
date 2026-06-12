export const TODO_ACTIONS = {
  //fetch operations
  FETCH_START: "FETCH_START",
  //setIsTodoListLoading(true)
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  FETCH_FILTER_ERROR: "FETCH_FILTER_ERROR",
  //separated fetch_error and fetch_filter_error to more easily use if/else
  //setIsTodoListLoading(false) -> setting back, success

  //add todo operations
  ADD_TODO_START: "ADD_TODO_START",
  ADD_TODO_SUCCESS: "ADD_TODO_SUCCESS",
  ADD_TODO_ERROR: "ADD_TODO_ERROR",

  COMPLETE_TODO_START: "COMPLETE_TODO_START",
  COMPLETE_TODO_SUCCESS: "COMPLETE_TODO_SUCCESS",
  COMPLETE_TODO_ERROR: "COMPLETE_TODO_ERROR",

  UPDATE_TODO_START: "UPDATE_TODO_START",
  UPDATE_TODO_SUCCESS: "UPDATE_TODO_SUCCESS",
  UPDATE_TODO_ERROR: "UPDATE_TODO_ERROR",

  SET_SORT: "SET_SORT",
  SET_FILTER: "SET_FILTER",
  CLEAR_ERROR: "CLEAR_ERROR",
  CLEAR_FILTER_ERROR: "CLEAR_FILTER_ERROR",
  RESET_FILTERS: "RESET_FILTERS",
  INVALIDATE_CACHE: "INVALIDATE_CACHE",
};

export const initialTodoState = {
  todoList: [],
  error: "",
  filterError: "",
  isTodoListLoading: false,
  sortBy: "creationDate",
  sortDirection: "desc",
  filterTerm: "",
  dataVersion: 0,
};

export function todoReducer(state, action) {
  switch (action.type) {
    //we'll add cases here

    //fetch actions
    case TODO_ACTIONS.FETCH_START:
      return {
        ...state,
        isTodoListLoading: true,
        error: "",
        filterError: "",
      };
    case TODO_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        todoList: action.payload.todos,
        isTodoListLoading: false,
        error: "",
        filterError: "",
      };
    case TODO_ACTIONS.FETCH_ERROR:
      return {
        ...state,
        error: action.payload.message,
        isTodoListLoading: false,
      };
    case TODO_ACTIONS.FETCH_FILTER_ERROR:
      return {
        ...state,
        filterError: action.payload.message,
        isTodoListLoading: false,
      };
    // add todo actions
    case TODO_ACTIONS.ADD_TODO_START: //send temp todo
      return {
        ...state,
        todoList: [action.payload.tempTodo, ...state.todoList],
        // this takes the current state (state.todoList), creates a
        // new array, puts tempTodo at the front,
        // and spreads the existing list after it
        error: "",
      };
    case TODO_ACTIONS.ADD_TODO_SUCCESS: // sending tempId and savedTodo
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.tempId ? action.payload.dataNewTodo : todo,
        ),
      };
    //remove todo that didn't save to the server
    case TODO_ACTIONS.ADD_TODO_ERROR:
      return {
        ...state,
        error: action.payload.message,
        todoList: state.todoList.filter(
          (todo) => todo.id !== action.payload.tempId,
        ),
      };
    // complete todo actions
    case TODO_ACTIONS.COMPLETE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          if (todo.id === action.payload.id) {
            return { ...todo, isCompleted: true };
          } else {
            return todo;
          }
        }),
      };
    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
      return {
        ...state,
      };
    case TODO_ACTIONS.COMPLETE_TODO_ERROR:
      return {
        ...state,
        error: action.payload.message,
        //rollback
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.id ? action.payload.origTodo : todo,
        ),
      };
    // update todo actions
    case TODO_ACTIONS.UPDATE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          if (todo.id === action.payload.editedTodo.id) {
            return { ...action.payload.editedTodo };
          } else {
            return todo;
          }
        }),
      };
    case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
      return {
        ...state,
      };
    case TODO_ACTIONS.UPDATE_TODO_ERROR:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.id ? action.payload.origTodo : todo,
        ),
      };

    //ui actions
    case TODO_ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDirection: action.payload.sortDirection,
      };
    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filterTerm: action.payload,
      };
    case TODO_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: "",
      };
    case TODO_ACTIONS.CLEAR_FILTER_ERROR:
      return {
        ...state,
        filterError: "",
      };
    case TODO_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filterTerm: "",
        sortBy: "creationDate",
        sortDirection: "desc",
        filterError: "",
      };
    case TODO_ACTIONS.INVALIDATE_CACHE:
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
