# file2md5

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![GitHub license](https://img.shields.io/github/license/bdwenxi/file2md5.svg)](https://github.com/bdwenxi/file2md5/blob/main/LICENSE)
[![GitHub release](https://img.shields.io/github/release/bdwenxi/file2md5.svg)](https://GitHub.com/bdwenxi/file2md5/releases/)

file2md5 is a browser-side implementation of file conversion to md5 format based on [SparkMD5](https://github.com/satazor/js-spark-md5), which supports typescript friendly.

## Features

- Supports Typescript

- Promise API

- All browsers supported

## Installation

**Npm**

```shell script
npm install file2md5 --save
```

**Yarn**

```shell script
yarn add file2md5
```

## Usage

**Html:**

```html
<input type="file" id="upload" />
```

**Javascript:**

```ts
import file2md5 from 'file2md5';

const el = document.querySelector('#upload');
const onProgress = progress => console.log('progress', progress);

const onChange = async e => {
    if (!e.target.files || !e.target.files[0]) {
        return;
    }

    const file = e.target.files[0];
    const abort = file2md5.abort;

    // Assuming that it takes 3s to convert the md5 value,
    // the simulation terminates the operation at 1s
    setTimeout(
        () => abort(),
        1000
    );

    try {
        const md5 = await file2md5(file, {chunkSize: 3 * 1024 * 1024, onProgress});
        console.log('md5 string:', md5); // d18bb890790c4335e57eadbedc801c2c
    }
    catch (e) {
        console.error('error', e);
    }
};

el.addEventListener(
    'change',
    onChange,
    false
);
```

**You can call the abort method to terminate before the end of the file conversion to the md5 value.**
```ts
const abort = file2md5.abort;

abort();
```

## Params

| Name | Required | Description | Type | Default value |
| ----- | ----- |-----|-----| ----- |
| file | true | The file is used to convert md5 format. | File | - |
| options | false | Optional configuration items. | IOptions | {} |

## Options

| Name | Required | Description | Type | Default value |
| ----- | ----- |-----|-----| ----- |
| chunkSize | false | The conversion is performed in chunks, so you can customize the size of each chunk. | number | 2 * 1024 * 1024 |
| raw | false | If raw is true, the result as a binary string will be returned instead. | boolean | false |
| onProgress | false | Callback function for monitoring progress. | (progress: number) => unknown | - |

## Browser compatibility

- IE10+
- Chrome latest 2 versions
- Firefox latest 2 versions
- Microsoft Edge latest 2 versions
- Safari latest 2 versions

## License

file2md5 is licensed under a [MIT License](https://github.com/bdwenxi/file2md5/blob/main/LICENSE)
