import { expect, test, describe } from '@jest/globals';
import constructorSlice, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import store from 'src/services/store';

const ingredients = {
  bun: {
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
  ingredients: [
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
    },
    {
      _id: '643d69a5c3f7b9001cfa093f',
      name: 'Мясо бессмертных моллюсков Protostomia',
      type: 'main',
      proteins: 433,
      fat: 244,
      carbohydrates: 33,
      calories: 420,
      price: 1337,
      image: 'https://code.s3.yandex.net/react/code/meat-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
      __v: 0,
      id: 'olP6NK9oOG7SCYr_Verqo'
    }
  ]
};

describe('Тест слайса конструктора', () => {
  test('Добавление булки в конструктор', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };

    const newState = constructorSlice(
      initialState,
      addIngredient(ingredients.bun)
    );
    expect(newState.bun).toBeDefined();
    expect(newState.bun).toMatchObject(ingredients.bun);
    expect(newState.bun).toHaveProperty('id');
    expect(newState.bun?.id).not.toBe('');
    expect(typeof newState.bun?.id).toBe('string');
  });
  test('Добавление ингридиента в конструктор', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };

    const newState = constructorSlice(
      initialState,
      addIngredient(ingredients.ingredients[0])
    );
    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toMatchObject([ingredients.ingredients[0]]);
    expect(newState.ingredients[0]).toHaveProperty('id');
    expect(newState.ingredients[0]?.id).not.toBe('');
    expect(typeof newState.ingredients[0]?.id).toBe('string');
  });
  test('Удаление ингридиентов из конструктора', () => {
    const initialState = {
      bun: {
        ...ingredients.bun,
        id: '2KshAas3YPWoCoJA4-ILp'
      },
      ingredients: [
        {
          ...ingredients.ingredients[0],
          id: 'JNYmhGSkprQz-bC-VB7Dd'
        }
      ]
    };
    const newState = constructorSlice(
      initialState,
      removeIngredient(initialState.ingredients[0])
    );
    expect(newState).toEqual({ ...initialState, ingredients: [] });

    const anotherState = constructorSlice(
      newState,
      removeIngredient(initialState.bun)
    );
    expect(anotherState).toEqual(newState);
  });
  test('Перемещение ингридиентов', () => {
    const initialState = {
      bun: {
        ...ingredients.bun,
        id: '2KshAas3YPWoCoJA4-ILp'
      },
      ingredients: [
        {
          ...ingredients.ingredients[0],
          id: 'JNYmhGSkprQz-bC-VB7Dd'
        },
        {
          ...ingredients.ingredients[1],
          id: 'olP6NK9oOG7SCYr_Verqo'
        }
      ]
    };
    const newState = constructorSlice(
      initialState,
      moveIngredient({ from: 0, to: 1 })
    );
    expect(newState).toEqual({
      bun: initialState.bun,
      ingredients: [initialState.ingredients[1], initialState.ingredients[0]]
    });
  });
  test('Очищение конструктора', () => {
    const initialState = {
      bun: {
        ...ingredients.bun,
        id: '2KshAas3YPWoCoJA4-ILp'
      },
      ingredients: [
        {
          ...ingredients.ingredients[0],
          id: 'JNYmhGSkprQz-bC-VB7Dd'
        },
        {
          ...ingredients.ingredients[1],
          id: 'olP6NK9oOG7SCYr_Verqo'
        }
      ]
    };
    const newState = constructorSlice(initialState, clearConstructor());
    expect(newState).toEqual({ bun: null, ingredients: [] });
  });
  test('Замена булок', () => {
    const initialState = {
      bun: {
        ...ingredients.bun,
        id: '2KshAas3YPWoCoJA4-ILp'
      },
      ingredients: [
        {
          ...ingredients.ingredients[0],
          id: 'JNYmhGSkprQz-bC-VB7Dd'
        },
        {
          ...ingredients.ingredients[1],
          id: 'olP6NK9oOG7SCYr_Verqo'
        }
      ]
    };
    const newBun = {
      _id: '643d69a5c3f7b9001cfa093d',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
      __v: 0
    };
    const newState = constructorSlice(initialState, addIngredient(newBun));
    expect(newState.bun).toBeDefined();
    expect(newState.bun).toMatchObject(newBun);
    expect(newState.bun).toHaveProperty('id');
    expect(newState.bun?.id).not.toBe('');
    expect(typeof newState.bun?.id).toBe('string');
  });

  test('Несуществующий экшн', () => {
    const newState = constructorSlice(undefined, { type: 'UNKNOWN' });
    expect(newState).toEqual({ bun: null, ingredients: [] });
  });
});
