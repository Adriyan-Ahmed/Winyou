export interface IReview {
  id: number;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  helpful: number;
  verified: boolean;
  tag?: string;
}
export const REVIEWS: IReview[] = [
  {
    id: 1,
    name: "Rakibul Hasan",
    avatar: "RH",
    location: "Dhaka",
    rating: 5,
    date: "12 Jan 2025",
    title: "Absolutely worth every taka!",
    body: "Delivery was super fast — got it within 2 days. Quality is exactly as shown in the photos, maybe even better. Packaging was neat and secure. Already recommended to friends. Will order again.",
    helpful: 24,
    verified: true,
    tag: "Fast Delivery",
  },
  {
    id: 2,
    name: "Sumaiya Akter",
    avatar: "SA",
    location: "Chittagong",
    rating: 5,
    date: "28 Feb 2025",
    title: "Exceeded my expectations",
    body: "I was skeptical at first ordering online, but this completely changed my mind. The product is premium quality and looks exactly like the pictures. Customer support was also very responsive.",
    helpful: 18,
    verified: true,
    tag: "Top Quality",
  },
  {
    id: 3,
    name: "Mehedi Islam",
    avatar: "MI",
    location: "Sylhet",
    rating: 4,
    date: "5 Mar 2025",
    title: "Great product, minor packaging issue",
    body: "Really happy with the purchase overall. The product quality is solid and feels durable. Minor issue was a small dent in the outer box — the product itself was perfectly fine. Still recommend buying.",
    helpful: 11,
    verified: true,
  },
  {
    id: 4,
    name: "Nusrat Jahan",
    avatar: "NJ",
    location: "Rajshahi",
    rating: 5,
    date: "19 Mar 2025",
    title: "Best purchase this year!",
    body: "Honestly one of the best things I've ordered online. Free shipping deal was a bonus. Arrived earlier than expected and was wrapped really carefully. Quality is top-notch — feels premium.",
    helpful: 31,
    verified: true,
    tag: "Best Value",
  },
  {
    id: 5,
    name: "Tanvir Ahmed",
    avatar: "TA",
    location: "Cumilla",
    rating: 4,
    date: "2 Apr 2025",
    title: "Solid quality, good value for money",
    body: "Ordered after a friend's recommendation. Satisfied with the quality — exactly what I needed. Delivery took about 3 days to Cumilla which is acceptable. Price is fair for the quality.",
    helpful: 9,
    verified: false,
  },
  {
    id: 6,
    name: "Fatema Khanam",
    avatar: "FK",
    location: "Khulna",
    rating: 5,
    date: "10 Apr 2025",
    title: "Perfect gift idea too!",
    body: "Bought this as a gift and the recipient absolutely loved it. The presentation and quality felt premium. Winyou me's packaging is really professional. Fast delivery to Khulna as well — very impressed!",
    helpful: 22,
    verified: true,
    tag: "Gift Ready",
  },
];
