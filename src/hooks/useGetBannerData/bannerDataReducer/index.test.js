import { bannerDataReducer, BANNER_DATA_ACTIONS } from '.';
import { INITIAL_STATE_BANNER_DATA } from '..';

describe('bannerDataReducer', () => {
  it(`${BANNER_DATA_ACTIONS.START_FETCH} action`, () => {
    // Arrange
    const action = { type: BANNER_DATA_ACTIONS.START_FETCH };

    // Act
    const newState = bannerDataReducer(INITIAL_STATE_BANNER_DATA, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_BANNER_DATA,
      loading: true,
      hasError: false,
    });
  });

  it(`${BANNER_DATA_ACTIONS.FINISH_FETCH} action`, () => {
    // Arrange
    const action = {
      type: BANNER_DATA_ACTIONS.FINISH_FETCH,
      payload: {
        title: 'fake title',
        description: 'fake description',
        backgroundUrl: 'fake background',
        imageUrl: 'fake image',
        functionality: 'fake functionality',
        fontColor: '#000',
      },
    };

    // Act
    const newState = bannerDataReducer(INITIAL_STATE_BANNER_DATA, action);

    // Assert
    expect(newState).toEqual({
      loading: false,
      hasError: false,
      bannerData: action.payload,
    });
  });

  it(`${BANNER_DATA_ACTIONS.FAIL_FETCH} action`, () => {
    // Arrange
    const action = { type: BANNER_DATA_ACTIONS.FAIL_FETCH };

    // Act
    const newState = bannerDataReducer(INITIAL_STATE_BANNER_DATA, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_BANNER_DATA,
      loading: false,
      hasError: true,
    });
  });

  it('should return initialState when the action is not defined', () => {
    // Arrange
    const action = {
      type: 'my-action',
    };

    // Act
    const newState = bannerDataReducer(INITIAL_STATE_BANNER_DATA, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_BANNER_DATA);
  });
});
