import SparkMD5 from 'spark-md5';

export interface IOptions {
    chunkSize?: number;
    raw?: boolean;
    onProgress?: (progress: number) => unknown;
}

type IResolvedResult = [md5: string, abort: () => void];

const file2md5 = function (file: File, options: IOptions): Promise<IResolvedResult> {
    const {chunkSize = 2 * 1024 * 1024, raw = false, onProgress} = options;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    const fileSize = file.size;
    const chunks = Math.ceil(fileSize / chunkSize);
    let currentChunk = 0;
    let progress = 0;

    const loadNext = function (): void {
        const start = currentChunk * chunkSize;
        const end = start + chunkSize >= fileSize ? fileSize : start + chunkSize;

        fileReader.readAsArrayBuffer(File.prototype.slice.call(file, start, end));
    };

    const abort = function (): void {
        fileReader.abort();
    };

    const execute = function (resolve: (...IResolvedResult) => void, reject: (err: DOMException | null) => void): void {
        fileReader.addEventListener(
            'load',
            e => {
                spark.append(e.target?.result as ArrayBuffer);
                currentChunk++;
                progress = +(currentChunk / chunks).toFixed(2);
                onProgress?.(progress);

                if (currentChunk < chunks) {
                    loadNext();
                    return;
                }

                // If raw is true, the result as a binary string will be returned instead
                resolve([spark.end(raw), abort]);
            }
        );

        fileReader.addEventListener(
            'abort',
            () => {
                // Resets the internal state of the computation
                spark.reset();
            }
        );

        fileReader.addEventListener(
            'error',
            () => {
                // Resets the internal state of the computation
                spark.reset();
                reject(fileReader.error);
            }
        );

        loadNext();
    };

    return new Promise<IResolvedResult>(execute);
};

export default file2md5;
