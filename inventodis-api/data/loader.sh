#!/bin/bash
redis-cli -p 6388 flushall

echo "Creating stores index"
redis-cli -p 6388 FT.CREATE store SCHEMA \
	store TAG SORTABLE \
	description TEXT \
	market TAG SORTABLE \
	parent TAG SORTABLE \
	address TEXT \
	city TEXT SORTABLE \
	country TAG SORTABLE \
	latitude NUMERIC SORTABLE \
	location GEO \
	longitude NUMERIC SORTABLE \
	state TAG SORTABLE \
	type TAG SORTABLE \
	postalCode TAG SORTABLE

riot-file -p 6388 import -t DELIMITED stores.csv --process location="#geo(longitude,latitude)" --header hset --include store description market parent address city country latitude longitude state location type postalCode --keyspace store --keys store

echo "Creating products index"
redis-cli -p 6388 FT.CREATE product SCHEMA \
	sku TAG SORTABLE \
	name TEXT \
	description TEXT PHONETIC dm:en \
	category TAG SORTABLE \
	categoryName TEXT \
	style TAG SORTABLE \
	styleName TEXT \
	isOrganic TAG SORTABLE \
	abv NUMERIC SORTABLE \
	icon TEXT \
	ibu NUMERIC SORTABLE \
	status TEXT \


riot-file -p 6388 import -t JSON products.json --process sku="sku" category="style.category.id" categoryName="style.category.name" styleName="style.shortName" style="style.id" icon="containsKey('labels')?labels.icon:null" hset --include sku name description category categoryName style styleName isOrganic abv icon ibu status --keyspace product --keys sku


echo "Creating inventory index"
redis-cli -p 6388 FT.CREATE inventory SCHEMA \
	id TAG SORTABLE \
	store TAG SORTABLE \
	sku TAG SORTABLE \
	location GEO \
	availableToPromise NUMERIC SORTABLE \
	onHand NUMERIC SORTABLE \
	allocated NUMERIC SORTABLE \
	reserved NUMERIC SORTABLE \
	virtualHold NUMERIC SORTABLE \
	epoch NUMERIC SORTABLE