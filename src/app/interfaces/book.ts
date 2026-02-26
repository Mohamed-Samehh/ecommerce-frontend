export interface Author {
    _id?: string;
    name: string;
    bio?: string;
}

export interface Category {
    _id?: string;
    name: string;
}

export interface Book {
    _id?: string;
    id?: string;
    title: string;
    author: string | Author;
    description?: string;
    price: number;
    category?: string | Category;
    imageUrl?: string;
    stock?: number;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
