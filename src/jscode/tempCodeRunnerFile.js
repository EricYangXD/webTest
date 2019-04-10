
    const trigger = () => {
        if (arr.length === 0) return;
        arr.shift()();
    };
    arr = arr.map(val => {
        return val.bind(null, trigger);
    });
    trigger();
}