document.addEventListener('alpine:init', () => {
    
    Alpine.data('posts', () => ({
        posts: [],
        perPage: 5,
        currentPage: 0,
        totalPage : 0,
        init(){
            this.$store.data.loadPost()
            this.$watch('perPage', value => {
                if(this.perPage < 1) this.perPage = 1
            })
            this.$watch('currentPage', value => {
                if(this.currentPage < 0) this.currentPage = 0
            })
            // this.$watch('totalPages', () => {
            //     console.log({dispatchtotalPages: this.totalPage})
            //     this.totalPage = Math.max(this.totalPages(), 1)
            //     this.$dispatch('totalpageschange', {totalPages : this.totalPage})
            // })
        },
        postList(){
            this.posts = this.$store.data.data
            return this.posts
        },
        sortPost(){
            return this.posts.slice((this.currentPage * this.perPage), this.perPage+(this.currentPage * this.perPage))             
        },
        totalPages(){
            totalPages = Math.ceil(parseInt(this.posts.length) / this.perPage) 
            this.totalPage = totalPages
            return totalPages
        },
        setCurrentPage(nb){
            this.currentPage = parseInt(nb)
        }
    }))

    Alpine.data('post', (post) => ({
        post: post,
        // init(){
        //     console.log({post})
        // },
        show: false,
        changeShow(){
            this.show = !this.show
            this.$dispatch('close', {id : post.id})
        },
        close(id){
            if(id != post.id)
                this.show = false
        }
    }))

    Alpine.data('pagination', (totalPages, currentPage = 0, maxVisibleButtons = 5) => ({
        totalPages,
        page : currentPage,
        maxVisibleButtons,
        init(){
            this.$watch('page', () => {
                // console.log({currentPage : this.page})
                this.currentPage = Math.min(this.page, this.totalPages - 1)
                this.$data.currentPage = this.page
                
            })
            // console.log({totalPages: this.totalPages, currentPage: this.page, maxVisibleButtons: this.maxVisibleButtons})
        },
        startPage(){
            const halfVisible = Math.floor(maxVisibleButtons / 2)
            // console.log({halfVisible})
            if(this.page <= halfVisible){
                return 1
            }
            if(this.page >= (this.totalPages - (halfVisible + 1))){
                return Math.max(this.totalPages - (this.maxVisibleButtons - 1), 1)
            }
            return this.page - halfVisible + 1
        },
        pagesPool(){
            const range = [];
            // console.log({range}, {startPage : this.startPage()}, {boucle: Math.min(this.startPage() + this.maxVisibleButtons - 1, this.totalPages)})
            startPage = this.startPage()
            for (
                let i = startPage;
                i <= Math.min(startPage + this.maxVisibleButtons - 1, this.totalPages);
                i++
                ) {
                    range.push({
                        name: i,
                        actived: i === this.page + 1
                    });
                }
            // console.log({first: range[0].name})
            if(range[0]?.name > Math.ceil(this.totalPages/2) + 1){
                range.unshift({
                    name: '...',
                    actived : false
                })
                range.unshift({
                    name: Math.ceil(this.totalPages/2),
                    actived : false
                })
            }
            if(range[range.length - 1]?.name < Math.ceil(this.totalPages/2) - 1){
                range.push({
                    name: '...',
                    actived : false
                })
                range.push({
                    name: Math.ceil(this.totalPages/2),
                    actived : false
                })
            }
            if(range[0]?.name != 1){
                range.unshift({
                    name: '...',
                    actived : false
                })
                range.unshift({
                    name: 1,
                    actived : false
                })
            }
            
            if(range[range.length - 1].name != this.totalPages){
                range.push({
                    name: '...',
                    actived : false
                })
                range.push({
                    name: this.totalPages,
                    actived : false
                })
            }
            // console.log({range})
            return range;
        },
        isInFirstPage() {
            return this.page === 0;
        },
        isInLastPage() {
            return this.page === this.totalPages-1;
        },
        incPage(){
            this.page++
            // this.currentPageChanger()
        },
        decPage(){
            this.page--
            // this.currentPageChanger()
        },
        setCurrentPage(nb){
            if(typeof nb == 'number')
                this.page = parseInt(nb)-1
        },
        // firstPage(){
        //     this.page = 0
        //     // this.currentPageChanger()
        // },
        // lastPage(){
        //     this.page = this.totalPages-1
        //     // this.currentPageChanger()
        // },
        // currentPageChanger(){
        //     this.$dispatch('currentpagechange', {currentPage : this.currentPage})
        // },
        setTotalPages(totalPages){
            console.log({totalPages})
            this.totalPages = parseInt(totalPages)
        },
    }))

    Alpine.data('articles', () => ({
        articles: [1,2,3,4,5,6,7,8,9,0,3,6,4,6,45,6,46,6,45,5,4,65,3,54,5,8,5],
        perPage: 5,
        currentPage: 0,
        totalPage : 0,
        init(){
            this.totalPages()
        },
        sortArticles(){
            return this.articles.slice((this.currentPage * this.perPage), this.perPage+(this.currentPage * this.perPage))             
        },
        totalPages(){
            const totalPage = Math.ceil(parseInt(this.articles.length) / this.perPage) 
            this.totalPage = totalPage
            return totalPage
        },
        setCurrentPage(nb){
            this.currentPage = parseInt(nb)
        }
    }))

    Alpine.store('data', {
        loading : false,
        data: Alpine.$persist([]).as('posts').using(sessionStorage),
        loadPost(){
            this.loading = true
            console.log('loading')
            fetch('https://jsonplaceholder.typicode.com/posts')
                .then((response) => response.json())
                .then((data) => {
                    this.data = data
                    this.loading = false
                    // console.log({data})
                });
        },
    })
})