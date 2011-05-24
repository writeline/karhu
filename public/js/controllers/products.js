karhu.Products = function(app) {
  app.get('#/products', function(context) {
    context.ajax_get('/categories', {}, function(categories) {
      context.ajax_get('/products', {}, function(products) {
        products = products.map(function(product) { return new karhu.Product(product, categories); });
        context.partial('templates/products/index.mustache', {products: products});
      });
    });
  });
  
  app.get('#/products/new', function(context) {
    context.ajax_get('/categories', {}, function(categories) {
      context.partial('templates/products/new.mustache', {categories: categories});
    });
  });
  
  app.post('#/products', function(context) {
    context.handleCancel(context.params.cancel, '#/products', function() {
      context.ajax_post('/products', context.params.product, function() {
        context.flash(context.params.product.name + ' successfully created.');
        context.redirect('#/products');      
      }, function() {
        context.flash('Not able to create ' + context.params.product.name);      
      });      
    });
  });

  app.get('#/products/:id/edit', function(context) {
    context.store.set('last_edited_product', context.params.id);
    context.ajax_get('/categories', {}, function(categories) {
      context.ajax_get('/products/' + context.params.id, {}, function(product) {
        context.partial('templates/products/edit.mustache', new karhu.EditProduct(product, categories));
      });
    });
  });
  
  app.put('#/products/:id', function(context) {
    context.store.clear('last_edited_product');
    context.handleCancel(context.params.cancel, '#/products', function() {
      context.ajax_put('/products/' + context.params.id, context.params.product, function() {
        context.flash(context.params.product.name + ' successfully updated.');
        context.redirect('#/products');
      }, function() {
        context.flash('Not able to update ' + context.params.product.name);      
      });
    });
  });
    
  app.del('#/products/:id', function(context) {
    context.ajax_delete('/products/' + context.params.id, {}, function() {
      context.flash(context.params.name + ' successfully deleted.');
      context.redirect('#/products');      
    }, function() {
      context.flash('Not able to delete ' + context.params.name);
    });
  });
};