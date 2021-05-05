from flask_restful import Resource
from flask import request
from main.server import db, cache, app
from main.server.models import MultiGallery, MultiGallerySchema
from flask_jwt import jwt_required

artwork_schema = MultiGallerySchema()
gallery_schema = MultiGallerySchema(many=True)


@app.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST'
    response.headers[
        'Access-Control-Allow-Headers'] = 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
    return response


class MultiGalleryCount(Resource):
    @cache.cached(timeout=100)
    def get(self):
        """Gets the number of messages available on the server"""
        return {'status': 'success', 'count': MultiGallery.query.count()}, 200


class MultiGalleryListResource(Resource):
    @cache.cached(timeout=100)
    def get(self):
        """Gets all Artwork on the server ordered by set id"""
        multigallery = MultiGallery.query.all()

        if not multigallery:
            return {
                'status': 'success',
                'multigallery': {}
            }, 206  # Partial Content Served, the other status code never loads

        # Create a map of {set_id: [art1, art2,...]}
        set_map = {}
        for artwork in multigallery:
            if artwork.setID not in set_map:
                set_map[artwork.setID] = [artwork]
                continue
            set_map[artwork.setID].append(artwork)
        gallery_list = [
            {"setID": set_id, "gallery": artworks}
            for set_id, artworks in set_map.items()
        ]

        multigallery_json = gallery_schema.dump(gallery_list)
        return {'status': 'success', 'multigallery': multigallery_json}, 200

    @jwt_required()
    def post(self):
        """Add Artwork"""
        json_data = request.get_json(force=True)

        if not json_data:
            return {'status': 'fail', 'message': 'No input data'}, 400

        errors = artwork_schema.validate(json_data)

        if errors:
            return {'status': 'fail', 'message': 'Error handling request'}, 422

        data = artwork_schema.load(json_data)

        entry = MultiGallery.query.filter_by(
            artworkLink=data.get('artworkLink')).first()

        if entry:
            return {'status': 'fail', 'message': 'Artwork already exists'}, 400

        entry = MultiGallery(
            setId=data.get('setId'),
            artworkLink=data.get('artworkLink'),
            artistLink=data.get('artistLink'),
            username=data.get('username'),
            title=data.get('title'))

        db.session.add(entry)
        db.session.commit()

        return {
            'status': 'success',
            'message': 'Artwork entry successfully created'
        }, 201
