let nums=[1,1,2,3,4,4]

    if (nums.length === 0) {
        return 0;
    }

    let i = 0;
    for (let j = 1; j < nums.length; j++) {
        if (nums[i] !== nums[j]) {
            i++;
            nums[i] = nums[j];
        }
    }

    console.log(nums);

    