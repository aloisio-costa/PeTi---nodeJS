
module.exports.averageReview = (applicantReviews)=> {
  let reviewAverage = 0;

    for(let review of applicantReviews){
        reviewAverage = reviewAverage + review.rating;
    }
    return reviewAverage = reviewAverage / applicantReviews.length;
  }
// for(let applicant of request.applicants){
//   if(applicant.reviews){
//     for(let review of applicant.reviews){
//       reviewAverage+=review
//     }
//   }
// }


