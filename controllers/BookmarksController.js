const Repository = require('../models/Repository');
const url = require('url');

module.exports =
    class BookmarksController extends require('./Controller') {
        constructor(req, res) {
            super(req, res);
            this.bookmarksRepository = new Repository('Bookmarks');
        }

        get(id) {
            let resultat = undefined;
            const reqUrl = url.parse(this.req.url, true);
            

            if (!isNaN(id)) {
                resultat = this.bookmarksRepository.get(id);
            } else {
                resultat = this.bookmarksRepository.getAll();
            }
            if (reqUrl.search == "?") {
                resultat = this.bookmarksRepository.getMenu();
                console.log("Chui la")
            }
            else {
                if (reqUrl.query.sort != undefined) {
                    if (reqUrl.query.sort == "name") {
                        resultat = this.bookmarksRepository.getAll();
                        resultat.sort(function compare(a, b) {
                            if (a.Name < b.Name) {
                                return -1;
                            }
                            if (a.Name > b.Name) {
                                return 1;
                            }
                            return 0;

                        });
                    }
                    if (reqUrl.query.sort == "category") {
                        resultat = this.bookmarksRepository.getAll();

                        resultat.sort(function compare(a, b) {
                            if (a.Category < b.Category) {
                                return -1;
                            }
                            if (a.Category > b.Category) {
                                return 1;
                            }
                            return 0;
                        });
                    }
                }
                if (reqUrl.query.name != undefined) {
                    if (reqUrl.query.name.endsWith("*")) {
                        resultat = this.bookmarksRepository.getByPrefix(reqUrl.query.name);
                    } else {
                        resultat = this.bookmarksRepository.getByName(reqUrl.query.name);
                    }
                }
                if (reqUrl.query.category != undefined) {
                    resultat = this.bookmarksRepository.getByCategorie(reqUrl.query.category);
                }
                
            }
            this.response.JSON(resultat);


        }

        post(bookmark) {
            // todo : validate contact before insertion
            // todo : avoid duplicates


            let newBookmark = this.bookmarksRepository.add(bookmark);
            if (newBookmark) {
                this.response.created(newBookmark);
            }
            else {
                this.response.internalError();
            }


        }

        put(id) {
            // todo : validate contact before updating

            if (this.bookmarksRepository.update(id)) {
                this.response.ok();
            }
            else {
                this.response.notFound();
            }
        }

        remove(id) {
            if (this.bookmarksRepository.remove(id)) {
                this.response.accepted();
            }
            else {
                this.response.notFound();
            }
        }

    }
