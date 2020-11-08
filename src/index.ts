import SparkMD5 from 'spark-md5';

export interface IOptions {
    chunkSize?: number;
    onProgress?: (progress: number) => unknown;
    onSuccess?: (md5: string) => unknown;
    onError?: (err: DOMException | null) => unknown;
}

export interface IMd5Action {
    (file: File): Promise<string>;
    abort(): void;
}

const file2md5 = function (options: IOptions): IMd5Action {
    const {chunkSize = 2 * 1024 * 1024, onProgress, onSuccess, onError} = options;

    const md5: IMd5Action = function (file: File) {
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();
        let currentChunk = 0;
        let progress = 0;

        const execute = function (resolve: (md5: string) => void, reject: (err: DOMException | null) => void) {
            const fileSize = file.size;
            const chunks = Math.ceil(fileSize / chunkSize);

            const loadNext = function (): void {
                const start = currentChunk * chunkSize;
                const end = start + chunkSize >= fileSize ? fileSize : start + chunkSize;

                fileReader.readAsArrayBuffer(File.prototype.slice.call(file, start, end));
            };

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

                    onSuccess?.(spark.end());
                    resolve(spark.end());
                }
            );

            fileReader.addEventListener(
                'error',
                () => {
                    onError?.(fileReader.error);
                    reject(fileReader.error);
                    spark.reset();
                }
            );

            loadNext();
        };

        return new Promise<string>(execute);
    }

    md5.abort = function () {
        // TODO
    };

    return md5;
};

export default file2md5;
