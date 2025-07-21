import dotenv from 'dotenv'
dotenv.config()


interface IenvConfig {
     PORT : string,
    DB_URL : string,
    NODE_ENV : "development" | "production"
}
const loadEnvVariables =(): IenvConfig =>{
    const requiredEnvVariables : string[] = ["PORT","DB_URL","NODE_ENV"] 
    requiredEnvVariables.forEach(key =>{
        if(!process.env[key]){
            throw new Error (`mising enviornment variables ${key}`)
        }
    })
    return {
    PORT : process.env.PORT as string,
    DB_URL : process.env.DB_URL!,
    NODE_ENV : process.env.NODE_ENV as "development" | "production"
}
}



export const envVars = loadEnvVariables()