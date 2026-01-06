import { IS3Service } from "../interfaces/IS3/IS3Service";
import { S3Client,
PutObjectCommand,
DeleteObjectCommand,
HeadObjectCommand,
GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3Service implements IS3Service{

    private _s3:S3Client;
    private _bucketName:string;

    constructor(){
        this._s3=new S3Client({
            region: process.env.AWS_REGION!,
        });

        this._bucketName=process.env.AWS_BUCKET_NAME!;
    }
    
    async uploadFile(data: Buffer, nombreArchivo: string): Promise<string> {
        try{
            await this._s3.send(new PutObjectCommand({
                Bucket:this._bucketName,
                Key:nombreArchivo,
                Body: data
            }));

            return nombreArchivo;
        }catch(error:any){
            console.log(`ha ocurrido un error inesperado ${error.message}`);
            return '';
        }
    }


    async getUriFile(nameFile: string): Promise<string> {
        try{
            const command=new GetObjectCommand({
                Bucket:this._bucketName,
                Key:nameFile
            });

            return await getSignedUrl(this._s3,command,{
                expiresIn: 36000,
            });
        }catch(error:any){
            console.log(`ha ocurrido un error inesperado ${error.message}`);
            return '';
        }
    }


    async deleteFile(fileName: string): Promise<void> {
        try{
            await this._s3.send(new HeadObjectCommand({
                Bucket:this._bucketName,
                Key:fileName
            }));

            await this._s3.send(new DeleteObjectCommand({
                Bucket:this._bucketName,
                Key:fileName
            }));

        }catch(error:any){
            console.log(`ha ocurrido un error inesperado ${error.message}`);
        }
    }
    
}