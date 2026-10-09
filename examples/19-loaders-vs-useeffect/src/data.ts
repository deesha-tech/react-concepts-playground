export interface Product { id: string; name: string; emoji: string; price: number; description: string }
export interface Review { id: string; author: string; rating: number; text: string }

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Trail Running Shoes', emoji: '👟', price: 4299, description: 'Light, grippy and ready for wet trails.' },
  { id: '2', name: 'Noise-cancelling Headphones', emoji: '🎧', price: 8999, description: 'Thirty hours of quiet, on a single charge.' },
  { id: '3', name: 'Pour-over Coffee Set', emoji: '☕', price: 1899, description: 'Dripper, glass server and a pack of filters.' },
];

export const REVIEWS: Record<string, Review[]> = {
  '1': [
    { id: 'r1', author: 'Ananya', rating: 5, text: 'Survived a muddy 10K without slipping once.' },
    { id: 'r2', author: 'Rohan', rating: 4, text: 'Runs a little narrow, so go half a size up.' },
  ],
  '2': [
    { id: 'r3', author: 'Meera', rating: 5, text: 'The office finally went silent.' },
    { id: 'r4', author: 'Kabir', rating: 4, text: 'Great sound, the case is a bit bulky.' },
  ],
  '3': [{ id: 'r5', author: 'Isha', rating: 5, text: 'My mornings got noticeably better.' }],
};
