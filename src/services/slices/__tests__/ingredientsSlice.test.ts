import { expect, test, describe } from '@jest/globals';
import ingridientsReducer, { fetchIngredients } from '../ingredientsSlice';
import store from 'src/services/store';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

const expectedIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0
  }
];
describe('Тест получения ингридиентов', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('fetchIngredients статус fulfilled', async () => {
    const getIngredientsSpy = jest
      .spyOn(require('@api'), 'getIngredientsApi')
      .mockResolvedValue(expectedIngredients);

    await store.dispatch(fetchIngredients());
    const { ingredients } = store.getState().ingredients;
    expect(ingredients).toEqual(expectedIngredients);
    expect(getIngredientsSpy).toHaveBeenCalledTimes(1);
  });
  test('fetchIngredients статус pending', () => {
    const currentState = {
      ingredients: expectedIngredients,
      isIngredientsLoading: false,
      error: null
    };
    const newState = ingridientsReducer(currentState, {
      type: fetchIngredients.pending.type
    });
    expect(newState.isIngredientsLoading).toBe(true);
    expect(newState.ingredients).toEqual(currentState.ingredients);
    expect(newState.error).toBeNull();
  });

  test('fetchIngredients статус rejected', () => {
    const currentState = {
      ingredients: [],
      isIngredientsLoading: true,
      error: null
    };

    const errorMessage = 'Ошибка сети';
    const newState = ingridientsReducer(currentState, {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    });
    expect(newState.ingredients).toEqual([]);
    expect(newState.error).toBe(errorMessage);
    expect(newState.isIngredientsLoading).toBe(false);
  });
  test('Несуществующий экшн', () => {
    const newState = ingridientsReducer(undefined, { type: 'UNKNOWN' });
    expect(newState).toEqual({
      ingredients: [],
      isIngredientsLoading: true,
      error: null
    });
  });
  test('fetchIngredients rejected сообщение об ошибке по умолчанию', () => {
    const currentState = {
      ingredients: [],
      isIngredientsLoading: true,
      error: null
    };

    const newState = ingridientsReducer(currentState, {
      type: fetchIngredients.rejected.type,
      error: {}
    });

    expect(newState.isIngredientsLoading).toBe(false);
    expect(newState.error).toBe('Ошибка загрузки');
    expect(newState.ingredients).toEqual([]);
  });
});
