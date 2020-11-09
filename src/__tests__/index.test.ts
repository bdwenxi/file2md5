import file2md5 from '../index';

jest.setTimeout(300000);

describe('file2md5', () => {
    test('test basic usage', async () => {
        const file = new window.File([new ArrayBuffer(1024)], 'test.txt');

        const md5 = await file2md5(file, {chunkSize: 3 * 1024 * 1024});
        expect(file).not.toBeNull();
        expect(typeof md5).toBe('string');
        expect(md5.length).toBeGreaterThan(0);
    });

    test('test "onProgress" callback', async () => {
        const file = new window.File([new ArrayBuffer(1024)], 'test.txt');
        const onProgress = jest.fn();

        await file2md5(file, {chunkSize: 3 * 1024 * 1024, onProgress});

        expect(onProgress).toHaveBeenCalled();
    });

    test('test "raw" property', async () => {
        const file = new window.File([new ArrayBuffer(1024)], 'test.txt');
        const md5 = await file2md5(file, {chunkSize: 3 * 1024 * 1024, raw: true});

        expect(typeof md5).toBe('string');
        expect(md5.length).toBeGreaterThan(0);
    });

    test('test huge file', async () => {
        const file = new window.File([new ArrayBuffer(300 * 1024 * 1024)], 'test.txt');
        const md5 = await file2md5(file, {chunkSize: 3 * 1024 * 1024});

        expect(typeof md5).toBe('string');
        expect(md5.length).toBeGreaterThan(0);
    });

    test('test abort method', async () => {
        const file = new window.File([new ArrayBuffer(700 * 1024 * 1024)], 'test.txt');
        const abort = jest.fn().mockImplementation(() => file2md5.abort());

        setTimeout(
            () => abort(),
            1500
        );

        const md5 = await file2md5(file, {chunkSize: 3 * 1024 * 1024});

        expect(abort).toHaveBeenCalled();
        expect(typeof md5).toBe('string');
        expect(md5).toBe('');
    });
});
