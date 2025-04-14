'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const getSorter = (options) => options.desc ? (result) => result * -1 : (result) => result;

function isNumber(v) {
    return typeof v === "number";
}
function isString(v) {
    return typeof v === "string";
}
function isDate(v) {
    return v instanceof Date;
}
function isFunction(v) {
    return typeof v === "function";
}

const parseDate = (parser, date) => {
    if (!isFunction(parser))
        return new Date(date);
    return parser(date);
};
/**
 * the sortable for the date values
 * @param options sortable options for byDate
 *
 * {@link https://sort-es.netlify.app/by-date byDate docs}
 * @version 1.0.0
 */
const byDate = (options = {
    desc: false,
    customParser: null,
    nullable: false,
}) => {
    const sorter = getSorter(options);
    return (first, second) => {
        if (isString(first) || isNumber(first))
            first = parseDate(options.customParser, first);
        if (isString(second) || isNumber(second))
            second = parseDate(options.customParser, second);
        return sorter(first.getTime() - second.getTime());
    };
};

/**
 * the sortable to sort the **number primitive**
 * @param options the options to sort the numbers correctly
 *
 * {@link https://sort-es.netlify.app/by-number byNumber docs}
 * @version 1.0.0
 */
const byNumber = (options = { desc: false, nullable: false }) => {
    const sorter = getSorter(options);
    return (first, second) => options.nullable
        ? sorter((first || 0) - (second || 0))
        : sorter(first - second);
};

const fixString = (value, options) => {
    if (options.lowercase)
        value = value.toLowerCase();
    if (options.nullable)
        value = value || "";
    return value;
};
/**
 * the sortable to sort the **string primitive**
 * @param options the options to sort the strings correctly
 *
 * {@link https://sort-es.netlify.app/by-string byString docs}
 * @version 1.0.0
 */
const byString = (options = {
    desc: false,
    nullable: false,
    lowercase: false,
}) => {
    const sorter = getSorter(options);
    return (first, second) => {
        return sorter(fixString(first, options).localeCompare(fixString(second, options)));
    };
};

const byAny = (options = { desc: false }) => {
    return (first, second) => {
        if (isNumber(first) && isNumber(second))
            return byNumber(options)(first, second);
        if (isString(first) && isString(second))
            return byString(options)(first, second);
        if (isDate(first) && isDate(second))
            return byDate(options)(first, second);
        throw new Error("incorrect types of the 2 parameters");
    };
};

function byValue(discriminator, sortFn) {
    if (typeof discriminator === "function") {
        return (first, second) => {
            const firstItem = discriminator(first);
            const secondItem = discriminator(second);
            return sortFn(firstItem, secondItem);
        };
    }
    return (first, second) => {
        const firstItem = first[discriminator];
        const secondItem = second[discriminator];
        return sortFn(firstItem, secondItem);
    };
}

function byValues(sorter) {
    if (Array.isArray(sorter)) {
        return (first, second) => {
            for (const [prop, sortableFn] of sorter) {
                if (!sortableFn)
                    continue;
                const sortResult = sortableFn(first[prop], second[prop]);
                if (sortResult !== 0)
                    return sortResult;
            }
            return 0;
        };
    }
    return (first, second) => {
        console.warn("do not pass the sorter for the byValue as object, use the array syntax");
        console.warn("this option will be removed in the next major release");
        for (const key in sorter) {
            if (!Object.prototype.hasOwnProperty.call(sorter, key))
                continue;
            const sortableFn = sorter[key];
            if (!sortableFn)
                continue;
            const sortResult = sortableFn(first[key], second[key]);
            if (sortResult !== 0)
                return sortResult;
        }
        return 0;
    };
}

/**
 * the sortable for the boolean values
 * @param options sortable options for byBoolean
 *
 * {@link https://sort-es.netlify.app/by-boolean byBoolean docs}
 * @version 1.3.0
 */
const byBoolean = (options = { desc: false }) => {
    const sorter = getSorter(options);
    return (first, second) => sorter(Number(second) - Number(first));
};

/**
 * the sortable for the async values
 * @param asyncItems the async items
 * @param sortFn the sortable to apply to the async items
 *
 * {@link https://sort-es.netlify.app/by-async sortAsync docs}
 * @version 1.0.0
 */
const sortAsync = async (asyncItems, sortFn) => {
    const items = await Promise.all(asyncItems);
    return items.sort(sortFn);
};
class AsyncArray extends Array {
    constructor(items) {
        super(...items);
    }
    async sortAsync(sortFn) {
        const items = await Promise.all(this);
        return items.sort(sortFn);
    }
}

var index = {
    byAny,
    byDate,
    byValue,
    byValues,
    byString,
    byNumber,
    sortAsync,
    byBoolean,
    AsyncArray,
};

exports.AsyncArray = AsyncArray;
exports.byAny = byAny;
exports.byBoolean = byBoolean;
exports.byDate = byDate;
exports.byNumber = byNumber;
exports.byString = byString;
exports.byValue = byValue;
exports.byValues = byValues;
exports.default = index;
exports.sortAsync = sortAsync;
