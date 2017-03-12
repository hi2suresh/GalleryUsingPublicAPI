//     $(document).ready(function(){
         var movieList = $('#movie-list');
         var bookList = $('#book-list');
         var moviesName = ['The Departed','Django Unchained', 'Shawshank Redemption', 'The Green Mile','Pulp Fiction','The Dark Knight'];
         var sortableMoviesByYear = [];
         var sortedMoviesByYear = [];
        
         var objStoredMovies = JSON.parse(localStorage.getItem('storedMovieDetails'));
        if(objStoredMovies === null){
                getMovieDetails();
            }
        else{
            appendMovieList(moviesName);
        }
        function getMovieDetails(){
         var objMovies = {};
         for(let i=0; i<moviesName.length; i++){
         $.ajax({
                url : 'http://www.omdbapi.com/',
                type : 'GET',
                data : {
                    't' : moviesName[i]
                },
                dataType:'json',
                success : function(data) {
                   
                    objMovies[moviesName[i]] = data;
                    //Store movie name and its year for sorting purpose
                    sortableMoviesByYear.push([moviesName[i],data.Year]);                    
                    createList(movieList,data.Poster, data.Title);
                },
                error : function(request,error)
                {
                    alert("Request: "+JSON.stringify(request));
                }
         });
        }
        
             $(document).ajaxStop(function() {
                localStorage.setItem('storedMovieDetails',JSON.stringify(objMovies));
                var tempSortedMoviesByYear =  sortableMoviesByYear.sort(function(a,b){           
                                        return parseInt(a[1]) - parseInt(b[1]);
                                    });
                 for(let i=0; i<tempSortedMoviesByYear.length; i++){
                     sortedMoviesByYear.push(tempSortedMoviesByYear[i][0]);
                 }
                localStorage.setItem('sortedMoviesByYear',JSON.stringify(sortedMoviesByYear)); 
                 invokeMagnificientPopup($('#movie-list a'), movieGalleryDetails);
            });      
       
    }
     
        function createList(parentElement,dataImage,dataTitle){
            var $li = $('<li></li>');
            var $a = $('<a></a>');
            var $img = $('<img/>');

            $a.attr('href',dataImage);
            $a.attr('Title',dataTitle);            
            $img.attr('src',dataImage);
            
            $a.append($img);
            $li.append($a);
            
            parentElement.append($li);
        }
        
        $('#movie-sort-button').click(function(){
            objStoredMovies = JSON.parse(localStorage.getItem('storedMovieDetails'));
            sortedMoviesByYear =  JSON.parse(localStorage.getItem('sortedMoviesByYear'));
            //Remove the previously created list items
            $("#movie-list").empty();
            appendMovieList(sortedMoviesByYear);
            invokeMagnificientPopup($('#movie-list a'), movieGalleryDetails);
        });           
        
        var openLibraryURL = 'https://openlibrary.org/api/books';
        var coversURL = 'https://covers.openlibrary.org/b/';
        var books = ["OLID:OL10446359M", "OLID:OL7829767M", "OLID:OL25317207M", "OLID:OL10682856M", "OLID:OL10236418M", "OLID:OL24982483M"];
        var booksName = [];

        var objStoredBooks = JSON.parse(localStorage.getItem('storedBookDetails'));
        if(objStoredBooks === null){
                getBooksDetail();
            }
        else{
            var bookArray = JSON.parse(localStorage.getItem('storedBookNames'));
            appendBookList(bookArray);
        }
        
         function appendMovieList(movieArray){
             for(let i=0; i<movieArray.length; i++){
                createList(movieList,objStoredMovies[movieArray[i]]['Poster'], movieArray[i]);
            }
        }
        
        function appendBookList(bookArray){
             for(let i=0; i<bookArray.length; i++){
                createList(bookList,objStoredBooks[bookArray[i]]['coversURL'], bookArray[i]);
            }
        }
        
        
        function getBooksDetail(){
        var objBooks = {};
        for(let i=0; i<books.length; i++){
            $.ajax({
                    url :'https://openlibrary.org/api/books',
                    type : 'GET',
                    data : {
                        'bibkeys' : books[i],
                         jscmd:'data',
                    },
                    dataType:'jsonp',

                    success : function(data) {
                      objBooks[data[books[i]].title] = data;
                      objBooks[data[books[i]].title]['coversURL'] =  coversURL + books[i].replace(':','/') +'-L.jpg';
                      booksName.push(data[books[i]].title);
                      createList(bookList, objBooks[data[books[i]].title]['coversURL'], data[books[i]].title );
                    },
                    error : function(request,error)
                    {
                        alert("Request: "+JSON.stringify(request));
                    }
             });
            }
            $(document).ajaxStop(function() {
                localStorage.setItem('storedBookDetails',JSON.stringify(objBooks));               
                localStorage.setItem('storedBookNames',JSON.stringify(booksName)); 
                localStorage.setItem('sortedBookNames',JSON.stringify(booksName.sort())); 
            });            
        }
        
         $('#book-sort-button').click(function(){
            objStoredBooks = JSON.parse(localStorage.getItem('storedBookDetails'));
            sortedBooks =  JSON.parse(localStorage.getItem('sortedBookNames'));
            //Remove the previously created list items
            $("#book-list").empty();
            appendBookList(sortedBooks);
            
        });
        
        var movieGalleryDetails = {
             titleSrc: function(item) {
                 var imageTittle = item.el[0].title;
                 var objStoredMovies = JSON.parse(localStorage.getItem('storedMovieDetails'));
                 var $title = $('<p class="gallery-details"></p>');
                 $title.text('Title: ' + imageTittle);
                 
                 var $released = $('<p class="gallery-details"></p>');
                 $released.text('Released: ' + objStoredMovies[imageTittle]['Released']);
                 
                 var $plot = $('<p></p>');
                 $plot.text('Plot: ' + objStoredMovies[imageTittle]['Plot']);
                 
                 var $awards = $('<p></p>');
                 $awards.text('Awards: ' + objStoredMovies[imageTittle]['Awards']);
                 
                 return $title.html() + '<br/>' + $released.html() + '<br/>' + $plot.html() + '<br/>' + $awards.html();
             }
        };

         var bookGalleryDetails = {
             titleSrc: function(item) {
                 var imageTittle = item.el[0].title;
                 var objStoredBooks = JSON.parse(localStorage.getItem('storedBookDetails'));
                 var $title = $('<p class="gallery-details"></p>');
                 $title.text('Title: ' + imageTittle);
                 
                 var $released = $('<p class="gallery-details"></p>');
                 $released.text('Released: ' + objStoredMovies[imageTittle]['Released']);
                 
                 var $plot = $('<p></p>');
                 $plot.text('Plot: ' + objStoredMovies[imageTittle]['Plot']);
                 
                 var $awards = $('<p></p>');
                 $awards.text('Awards: ' + objStoredMovies[imageTittle]['Awards']);
                 
                 return $title.html() + '<br/>' + $released.html() + '<br/>' + $plot.html() + '<br/>' + $awards.html();
             }
        };

        function invokeMagnificientPopup(parentGallery, galleryDetails){            
              parentGallery.magnificPopup({
                type: 'image',
                 gallery:{
                    enabled:true
                },
        image: movieGalleryDetails
        });
        }
        
//     });
    