declare module 'sequelize' {
  export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

  export class Sequelize {
    constructor(database: string, username: string, password: string, options: any)
    authenticate(): Promise<void>
  }

  export class Model<T = any, C = any> {
    static init(...args: any[]): any
    static belongsTo(target: any, options?: any): any
    static hasOne(target: any, options?: any): any
    static hasMany(target: any, options?: any): any
    static belongsToMany(target: any, options?: any): any
    // Minimal static query APIs used in the codebase
    static findAll(this: any, options?: any): Promise<any[]>
    static findByPk(this: any, identifier: any, options?: any): Promise<any | null>
    static create(this: any, values?: any, options?: any): Promise<any>
    static findOrCreate(this: any, options?: any): Promise<[any, boolean]>
    static destroy(this: any, options?: any): Promise<number>

    // Minimal instance mutation APIs used in the codebase
    save(options?: any): Promise<this>
    destroy(options?: any): Promise<void>
  }

  export const DataTypes: any
}


