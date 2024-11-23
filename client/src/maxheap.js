// heapSort.js

function heapify(arr, n, i, isAscending) {
    let extreme = i; // Initialize largest or smallest as root
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (isAscending) {
        // Min-heap condition
        if (left < n && arr[left].price < arr[extreme].price) {
            extreme = left;
        }
        if (right < n && arr[right].price < arr[extreme].price) {
            extreme = right;
        }
    } else {
        // Max-heap condition
        if (left < n && arr[left].price > arr[extreme].price) {
            extreme = left;
        }
        if (right < n && arr[right].price > arr[extreme].price) {
            extreme = right;
        }
    }

    if (extreme !== i) {
        [arr[i], arr[extreme]] = [arr[extreme], arr[i]]; // Swap
        heapify(arr, n, extreme, isAscending);
    }
}

function heapSort(arr, isAscending = true) {
    const n = arr.length;

    // Build heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i, isAscending);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]]; // Swap
        heapify(arr, i, 0, isAscending);
    }

    return arr;
}

export default heapSort;
