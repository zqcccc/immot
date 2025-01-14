import * as immot from '../src/immot';

test('Test $set', () => {
  interface DemoType {
    info: {
      sales: {
        users: {
          tom: string;
          tony?: string;
        };
        money: number;
      };
      products: string[];
    };
  }

  const demoData: DemoType = {
    info: {
      sales: {
        users: {
          tom: 'good',
        },
        money: 2000,
      },
      products: ['phone', 'book', 'milk'],
    },
  };

  const demo1 = immot.$set(demoData.info, 'products', ['apple']);
  expect(demo1).toEqual({
    sales: {
      users: {
        tom: 'good',
      },
      money: 2000,
    },
    products: ['apple'],
  });
  expect(demoData.info.products).toEqual(['phone', 'book', 'milk']);
  expect(demo1.sales).toBe(demoData.info.sales);
  expect(demo1.products).not.toBe(demoData.info.products);

  const demo2 = immot.$set(demoData.info.products, 1, 'apple');
  expect(demo2).toEqual(['phone', 'apple', 'milk']);
  expect(demo2).not.toBe(demoData.info.products);

  const demo3 = immot.$set(demoData.info.sales.users, 'tony', 'ok');
  expect(demo3).toEqual({
    tom: 'good',
    tony: 'ok',
  });
  expect(demo3).not.toBe(demoData.info.sales.users);

  const demo4 = immot.$set(demo3, 'tony', 'ok');
  expect(demo4).toBe(demo3);

  const demoDataMap1 = new Map([
    ['tom', 1],
    ['jerry', 2],
  ]);
  const demoMap1 = immot.$set(demoDataMap1, 'tom', 2);
  expect(demoMap1).not.toBe(demoDataMap1);
  expect(demoMap1.get('tom')).not.toBe(demoDataMap1.get('tom'));
  expect(demoMap1.get('jerry')).toBe(demoDataMap1.get('jerry'));
});

test('Test $setIn', () => {
  const demoData = {
    info: {
      sales: {
        users: {
          tom: 'good',
        },
        money: undefined as undefined | number[],
      },
      products: ['phone', 'book', 'milk'],
    },
  };

  const demo1 = immot.$setIn(demoData, ['info', 'sales', 'users', 'tom'] as const, '1');

  expect(demo1).toEqual({
    info: {
      sales: {
        users: {
          tom: 'bad',
        },
        money: undefined,
      },
      products: ['phone', 'book', 'milk'],
    },
  });
  expect(demo1).not.toBe(demoData);
  expect(demo1.info).not.toBe(demoData.info);
  expect(demo1.info.sales).not.toBe(demoData.info.sales);
  expect(demo1.info.sales.users).not.toBe(demoData.info.sales.users);
  expect(demo1.info.products).toBe(demoData.info.products);
  expect(demo1.info.sales.money).toBe(demoData.info.sales.money);

  const demo2 = immot.$setIn(demoData, ['info', 'sales', 'money', 1] as const, 500);

  expect(demo2).toEqual({
    info: {
      sales: {
        users: {
          tom: 'good',
        },
        money: [undefined, 500],
      },
      products: ['phone', 'book', 'milk'],
    },
  });

  expect(demo2.info).not.toBe(demoData.info);
  expect(demo2.info.sales).not.toBe(demoData.info.sales);
  expect(demo2.info.sales.users).toBe(demoData.info.sales.users);
  expect(demoData.info.sales.money).toBeUndefined();

  const demo3 = immot.$setIn(demo2, ['info', 'sales', 'money', 1] as const, 500);
  expect(demo3).toBe(demo2);

  const profile = {
    userList: [{ username: 'jack' }],
  };

  const nextProfile = immot.$setIn(profile, ['userList', 1, 'username'] as const, 'tom');

  expect(nextProfile).toEqual({
    userList: [{ username: 'jack' }, { username: 'tom' }],
  });
  expect(nextProfile.userList).not.toBe(profile.userList);
  expect(nextProfile.userList[0]).toBe(profile.userList[0]);

  const demoDataMap = {
    info: new Map([
      ['jack', 10],
      ['tom', 20],
    ]),
  };

  const demoMap1 = immot.$setIn(demoDataMap, ['info', 'jack'] as const, 20);

  expect(demoMap1).toEqual({
    info: new Map([
      ['jack', 20],
      ['tom', 20],
    ]),
  });

  const demoDataMap2 = {
    info: new Map([
      ['jack', { money: 10 }],
      ['tom', { money: 10 }],
    ]),
    property: [1],
  };

  const demoMap2 = immot.$setIn(demoDataMap2, ['info', 'jack', 'money'] as const, 20);

  expect(demoMap2).toEqual({
    info: new Map([
      ['jack', { money: 20 }],
      ['tom', { money: 10 }],
    ]),
    property: [1],
  });
  expect(demoMap2.info).not.toBe(demoDataMap2.info);
  expect(demoMap2.info.get('jack')).not.toBe(demoDataMap2.info.get('jack'));
  expect(demoMap2.info.get('tom')).toBe(demoDataMap2.info.get('tom'));
  expect(demoMap2.property).toBe(demoDataMap2.property);

  interface DemoData4 {
    info: {
      jack?: {
        money: number;
      };
      tom?: {
        money: number;
      };
    };
  }

  const demoData4: DemoData4 = {
    info: {
      jack: {
        money: 10,
      },
    },
  };

  const demo4 = immot.$setIn(demoData4, ['info', 'jack'] as const, undefined);
  expect(demo4).toEqual({
    info: {
      jack: undefined,
    },
  });
  const demo5 = immot.$setIn(demo4, ['info', 'tom', 'money'] as const, 10);
  expect(demo5).toEqual({
    info: {
      jack: undefined,
      tom: {
        money: 10,
      },
    },
  });
});

test('Test $merge', () => {
  const demoData = {
    tom: 'good',
    jack: undefined as string | undefined,
  };

  const demo1 = immot.$merge(demoData, { tom: 'bad', jack: 'good' });
  expect(demo1).toEqual({
    tom: 'bad',
    jack: 'good',
  });
  expect(demo1).not.toBe(demoData);

  const demoData1 = [1, 2, 3, 4];

  const demo2 = immot.$merge(demoData1, [5, 6]);
  expect(demo2).toEqual([5, 6, 3, 4]);
  expect(demo2).not.toBe(demoData1);
});

test('Test $mergeIn', () => {
  const demoData = {
    info: {
      users: {
        tom: 'good',
      },
      money: [100, 200, 300],
    },
  };

  const demo1 = immot.$mergeIn(demoData, ['info', 'users'] as const, {
    tom: 'bad',
  });
  expect(demo1).toEqual({
    info: {
      users: {
        tom: 'bad',
      },
      money: [100, 200, 300],
    },
  });
  expect(demo1).not.toBe(demoData);
  expect(demo1.info).not.toBe(demoData.info);
  expect(demo1.info.users).not.toBe(demoData.info.users);
  expect(demo1.info.money).toBe(demoData.info.money);

  const demo2 = immot.$mergeIn(demoData, ['info', 'money'] as const, [400]);

  expect(demo2).toEqual({
    info: {
      users: {
        tom: 'good',
      },
      money: [400, 200, 300],
    },
  });
  expect(demo2.info.money).not.toBe(demoData.info.money);
});

test('Test $update', () => {
  const demoData = {
    money: 1,
  };

  const demo1 = immot.$update(demoData, 'money', (prev) => prev + 1);
  expect(demo1).toEqual({
    money: 2,
  });
  expect(demo1).not.toBe(demoData);
});

test('Test $updateIn', () => {
  const demoData = {
    money: [
      {
        user: 'tom',
      },
    ],
  };

  const demo1 = immot.$updateIn(demoData, ['money', 0, 'user'] as const, (prev) => `${prev} & jerry`);
  expect(demo1).toEqual({
    money: [
      {
        user: 'tom & jerry',
      },
    ],
  });
  expect(demo1).not.toBe(demoData);

  const demo2 = immot.$updateIn(demoData, ['money', 1, 'user'] as const, () => 'jerry');
  expect(demo2).toEqual({
    money: [
      {
        user: 'tom',
      },
      {
        user: 'jerry',
      },
    ],
  });
  expect(demo2).not.toBe(demoData);
  expect(demo2.money[0]).toBe(demoData.money[0]);
});

test('Test $delete', () => {
  const demoData = {
    money: [1, 2, 3],
    old: 12 as number | undefined,
  };

  const demo1 = immot.$delete(demoData.money, 1);
  expect(demo1).toEqual([1, 3]);
  expect(demo1).not.toBe(demoData.money);

  const demo2 = immot.$delete(demoData, 'old');
  expect(demo2).toEqual({
    money: [1, 2, 3],
  });
  expect(demo2).not.toBe(demoData);
  expect(demo2.money).toBe(demoData.money);

  const demo3 = immot.$delete(demoData.money, [0, 2]);

  expect(demo3).toEqual([2]);
  expect(demo3).not.toBe(demoData.money);

  const demoData2 = {
    money: [1, 2, 3] as number[] | undefined,
    old: 12 as number | undefined,
  };

  const demo4 = immot.$delete(demoData2, ['money', 'old']);
  expect(demo4).toEqual({});
  expect(demo4).not.toBe(demoData2);

  const demoData3 = new Map([
    ['tom', 1],
    ['jerry', 2],
  ]);

  const demo5 = immot.$delete(demoData3, 'tom');
  expect(demo5).toEqual(new Map([['jerry', 2]]));

  const demo6 = immot.$delete(demoData3, ['tom', 'jerry']);
  expect(demo6).toEqual(new Map());
});

test('Test $push', () => {
  const demoData = [1, 2, 3];

  const demo1 = immot.$push(demoData, 4);
  expect(demo1).toEqual([1, 2, 3, 4]);
  expect(demo1).not.toBe(demoData);

  const demo2 = immot.$push(demoData, 4, 5);
  expect(demo2).toEqual([1, 2, 3, 4, 5]);
  expect(demo1).not.toBe(demoData);
  expect(demo2).not.toBe(demo1);
});

test('Test $pop', () => {
  const demoData = [1, 2, 3];

  const demo1 = immot.$pop(demoData);
  expect(demo1).toEqual([1, 2]);
  expect(demo1).not.toBe(demoData);
});

test('Test $shift', () => {
  const demoData = [1, 2, 3];

  const demo1 = immot.$shift(demoData);
  expect(demo1).toEqual([2, 3]);
  expect(demo1).not.toBe(demoData);
});

test('Test $unshift', () => {
  const demoData = [1, 2, 3];

  const demo1 = immot.$unshift(demoData, 0);
  expect(demo1).toEqual([0, 1, 2, 3]);
  expect(demo1).not.toBe(demoData);
});

test('Test $splice', () => {
  const demoData = [1, 2, 3];

  const demo1 = immot.$splice(demoData, 1, 0, 1.5);
  expect(demo1).toEqual([1, 1.5, 2, 3]);
  expect(demo1).not.toBe(demoData);

  const demo2 = immot.$splice(demoData, 1, 0, 10, 20);
  expect(demo2).toEqual([1, 10, 20, 2, 3]);
  expect(demo2).not.toBe(demoData);
});

test('Test todo list', () => {
  interface TodoItem {
    title: string;
    complete?: boolean;
  }

  const state = {
    todoList: [
      {
        title: 'A',
      },
    ] as TodoItem[],
  };
  // add
  const demo1 = immot.$update(state, 'todoList', (list) => immot.$push(list, { title: 'B' }));
  expect(demo1).toEqual({
    todoList: [
      {
        title: 'A',
      },
      {
        title: 'B',
      },
    ],
  });
  expect(demo1.todoList[0]).toBe(state.todoList[0]);

  // update title
  const demo2 = immot.$setIn(demo1, ['todoList', 0, 'title'] as const, 'C');

  expect(demo2).toEqual({
    todoList: [
      {
        title: 'C',
      },
      {
        title: 'B',
      },
    ],
  });

  const demo3 = immot.$updateIn(demo2, ['todoList', 0, 'complete'] as const, (complete) => !complete);

  expect(demo3).toEqual({
    todoList: [
      {
        title: 'C',
        complete: true,
      },
      {
        title: 'B',
      },
    ],
  });

  // delete
  const demo4 = immot.$updateIn(demo3, ['todoList', 0] as const, (todoItem) => immot.$delete(todoItem, 'complete'));

  expect(demo4).toEqual({
    todoList: [
      {
        title: 'C',
      },
      {
        title: 'B',
      },
    ],
  });
});
