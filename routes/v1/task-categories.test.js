const task_categories_v1 = require('./task-categories');

test('v1_get existence', () => {
    let fun = task_categories_v1.get;
    expect(fun).toBeDefined();
    expect(fun).toBeInstanceOf(Function);
});

test('v1_post existence', () => {
    let fun = task_categories_v1.post;
    expect(fun).toBeDefined();
    expect(fun).toBeInstanceOf(Function);
});

test('v1_put existence', () => {
    let fun = task_categories_v1.put;
    expect(fun).toBeDefined();
    expect(fun).toBeInstanceOf(Function);
});

test('v1_delete existence', () => {
    let fun = task_categories_v1.delete;
    expect(fun).toBeDefined();
    expect(fun).toBeInstanceOf(Function);
});