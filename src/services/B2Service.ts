import { IB2Service } from "../interfaces/IB2/IB2Service";
import B2 from 'backblaze-b2'


export class B2Service implements IB2Service{

    private b2:B2;
    private bucketId!:string;
    private bucketName!:string;
    private _authorice: any;

    constructor(){
        this.b2=new B2({
            applicationKeyId: process.env.KEY_ID!,
            applicationKey: process.env.APY_KEY!
        })

        this.bucketId= process.env.BUCKET_ID!;
        this.bucketName=process.env.BUCKET_NAME!;
        
    }
    async deleteFile(fileName: string): Promise<void> {
        await this.authorize();


        // 2. Buscar el archivo por nombre para obtener fileId
        const fileList = await this.b2.listFileNames({
            bucketId: this.bucketId,
            prefix: fileName,
            maxFileCount: 1,
            startFileName: fileName,
            delimiter: '',
        });

        if (!fileList.data.files.length) {
            throw new Error(`El archivo ${fileName} no existe en B2`);
        }

        const file=fileList.data.files[0];

        // 3. Borrar versión del archivo
        await this.b2.deleteFileVersion({
            fileId: file.fileId,
            fileName: file.fileName
        });

        console.log(`Archivo eliminado: ${fileName}`);

    }

    private async authorize(){
        this._authorice=await this.b2.authorize();
    }



    async uploadFile(data: Buffer, nombreArchivo: string): Promise<string> {
        await this.authorize();

        const uploadUrl=await this.b2.getUploadUrl({
            bucketId:this.bucketId,
        });

        const result = await this.b2.uploadFile({
            uploadUrl: uploadUrl.data.uploadUrl,
            uploadAuthToken: uploadUrl.data.authorizationToken,
            fileName: nombreArchivo,
            data: data, // Buffer del archivo
        });

        return result.data.fileName;
    }


    async getUriFile(fileName: string): Promise<string> {
        await this.authorize();

        const response=await this.b2.getDownloadAuthorization({
            bucketId: this.bucketId,
            fileNamePrefix: fileName,
            validDurationInSeconds: 3600
        });

        const downloadUrl=this._authorice.data.downloadUrl;


        // URL completa
        return `${downloadUrl}/file/${this.bucketName}/${fileName}?Authorization=${response.data.authorizationToken}`;

    }
    
}