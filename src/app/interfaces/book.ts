export interface Author {
    id: string;
    firstName: string;
    lastName: string;
    nationality?: string;
    biography?: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface Book {
    id: string;
    name: string;
    coverImage: string;
    coverImagePublicId: string;
    price: number;
    stock: number;
    authorId: string | Author;
    categories: string[] | Category[];
    description: string;
    isDeleted: boolean;
    status: 'avaliable' | 'out of stock' | 'low stock';
    reviewCount?: number;
    createdAt?: string;
    updatedAt?: string;
}
