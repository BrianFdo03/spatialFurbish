// discussed not to add reviews page now




// import { Layout } from "@/components/Dashboard/Layout";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Check, Trash2, Star } from "lucide-react";

// const reviews = [
//     {
//         id: 1,
//         product: "Hydrating Serum",
//         customer: "Sarah M.",
//         rating: 5,
//         review: "Absolutely love this serum!",
//         status: "Pending",
//     },
//     {
//         id: 2,
//         product: "Daily Moisturizer",
//         customer: "Jessica K.",
//         rating: 2,
//         review: "Caused a breakout. Not for me.",
//         status: "Approved",
//     },
//     {
//         id: 3,
//         product: "Sun Defense SPF",
//         customer: "Emily R.",
//         rating: 5,
//         review: "Best sunscreen ever. No white cast.",
//         status: "Approved",
//     },
// ];

// export function ReviewsPage() {
//     // Helper to render stars
//     const renderStars = (rating: number) => {
//         return (
//             <div className="flex gap-0.5">
//                 {[...Array(5)].map((_, i) => (
//                     <Star
//                         key={i}
//                         className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-stone-200 text-stone-200"
//                             }`}
//                     />
//                 ))}
//             </div>
//         );
//     };

//     return (
//         <Layout title="Reviews Moderation">
//             <Card className="border-none shadow-sm">
//                 <CardContent className="p-0">
//                     <Table>
//                         <TableHeader className="bg-stone-50">
//                             <TableRow>
//                                 <TableHead className="font-medium text-stone-600 pl-6">Product</TableHead>
//                                 <TableHead className="font-medium text-stone-600">Customer</TableHead>
//                                 <TableHead className="font-medium text-stone-600">Rating</TableHead>
//                                 <TableHead className="font-medium text-stone-600">Review</TableHead>
//                                 <TableHead className="font-medium text-stone-600">Status</TableHead>
//                                 <TableHead className="font-medium text-stone-600 text-right pr-6">Actions</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {reviews.map((review) => (
//                                 <TableRow key={review.id} className="hover:bg-stone-50/50">
//                                     <TableCell className="font-medium text-stone-800 pl-6 align-top pt-4">
//                                         {review.product}
//                                     </TableCell>
//                                     <TableCell className="text-stone-600 align-top pt-4">{review.customer}</TableCell>
//                                     <TableCell className="align-top pt-4">
//                                         {renderStars(review.rating)}
//                                     </TableCell>
//                                     <TableCell className="text-stone-600 align-top pt-4 max-w-xs truncate">
//                                         {review.review}
//                                     </TableCell>
//                                     <TableCell className="align-top pt-4">
//                                         <Badge
//                                             className={`shadow-none border-none font-medium ${review.status === "Pending"
//                                                 ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
//                                                 : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
//                                                 }`}
//                                         >
//                                             {review.status}
//                                         </Badge>
//                                     </TableCell>
//                                     <TableCell className="text-right pr-6 space-x-2 align-top pt-3">
//                                         <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
//                                             <Check className="w-4 h-4" />
//                                         </Button>
//                                         <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
//                                             <Trash2 className="w-4 h-4" />
//                                         </Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </CardContent>
//             </Card>
//         </Layout>
//     );
// }