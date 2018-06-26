'use strict';

const 
  co = require('co'),
  _ = require('lodash'),
  format = require('string-format');

class PGModel {
  constructor (dependencies) {
    this.pgp = dependencies.pgpPriceEngine
  }

  _constructFilterQuery(options, tableName) {
    let me = this;
    let filterQuery = 'SELECT id, {0}, created_date, modified_date FROM {1} WHERE ';
    let partitionFilterQuery = 'SELECT id, {0}, created_date, modified_date FROM {1} WHERE ';
    let aggregrateFilterQuery = 'SELECT {0} FROM {1} WHERE ';
    if(options && options.getRowCount){
      filterQuery = aggregrateFilterQuery;
    }
    let filterParams = [];
    let i = 1;
    if (options) {
      if (options.keys) {
        for (let key of options.keys) {
          if(key.multiColumnName && _.isArray(key.multiColumnName) && _.isArray(key.value)) {
            let queryStr = []
            _.each(key.value, function (innerArray) { 
              filterParams = filterParams.concat(innerArray);
              let innerQueryStr = [];
              for(let itx = 0; itx < innerArray.length; itx++){
                innerQueryStr.push(`$${i++}`)
              }
              queryStr.push(`(${innerQueryStr.join(',')})`)
            });
            filterQuery += me._getColumnName(key) + ` IN (` + queryStr.join(',') + `) AND `;
          }
          else if (_.isArray(key.value)) {
            let queryStr = [];
            // Support cases wherein values contains NULL in the array. ['NULL', 'x', 1]
            // Query should be key is NULL OR key IN ('x', 1)
            let containsNull = _.remove(key.value, (val) => val === 'NULL');
            if (!_.isEmpty(containsNull) && !_.isEmpty(key.value)) {
              filterQuery += `(`+ me._getColumnName(key) + ` IS NULL OR `
            } 
            else if (!_.isEmpty(containsNull) && _.isEmpty(key.value)) {
              filterQuery +=  me._getColumnName(key) + ` IS NULL AND `
            }
            if (!_.isEmpty(key.value)) {
              _.each(key.value, function () { queryStr.push(`$${i++}`) });
              filterParams = filterParams.concat(key.value);
              filterQuery += me._getColumnName(key) + ` IN (` + queryStr.join(',') + `)`;
              if (!_.isEmpty(containsNull)) {
                filterQuery += `)`;
              }
              filterQuery +=` AND `;
            }
          }
          else if(key.gt){
            filterQuery += me._getColumnName(key) + ` > $${i++} AND `;
            filterParams.push(key.gt);
          }
          else if(key.gte){
            filterQuery += me._getColumnName(key) + ` >= $${i++} AND `;
            filterParams.push(key.gte);
          }
          else if(key.lt){
            filterQuery += me._getColumnName(key) + ` < $${i++} AND `;
            filterParams.push(key.lt);
          }
          else if(key.lte){
            filterQuery += me._getColumnName(key) + ` <= $${i++} AND `;
            filterParams.push(key.lte);
          }
          else if (key.value !== undefined){
            if(key.value === 'NULL') {
              filterQuery += me._getColumnName(key) + ` IS NULL AND `
            } else {
              filterQuery += me._getColumnName(key) + ` = $${i++} AND `;
              filterParams.push(key.value);
            }
          }
          else if (key.ne){
            if(key.value === 'NULL') {
              filterQuery += me._getColumnName(key) + ` IS NOT NULL AND `
            } else {
              filterQuery += me._getColumnName(key) + ` != $${i++} AND `;
              filterParams.push(key.ne);
            }
          }
          else if (key.like){
            filterQuery += me._getColumnName(key) + ` LIKE $${i++} AND `;
            filterParams.push(key.like);
          }
          else if (key.notIn){
            let queryStr = []
            _.each(key.notIn, function () { queryStr.push(`$${i++}`) });
            filterQuery += me._getColumnName(key) + ` NOT IN (` + queryStr.join(',') + `) AND `;
            filterParams = filterParams.concat(key.notIn);
          }
          else {
            throw new Error("Filter value cannot be undefined!");
          }

        }
      }
    }

    if (!options.keys) {
      // Removes the trailing WHERE when there are no filters
      filterQuery = filterQuery.slice(0, -6);
    }
    else {
      // Removes the trailing AND when there are filters
      filterQuery = filterQuery.slice(0, -4);
    }

    if (options.order) {
      if (options.order.field && options.order.fields) {
        throw Error("Cannot have both order.field and order.fields for order by");
      }

      if (options.order.field) {
        filterQuery += ` Order by ${options.order.field}`
        if (options.order.isDesc === true)
          filterQuery += ' desc'
        else {
          filterQuery += ' asc'
        }
      } else if (!_.isEmpty(options.order.fields)) {
        filterQuery += ' Order by';
        let isFirst = true;
        //eg. { fields: [ { field: "expiration_date", isDesc: false }, { field: "priority", isDesc: false }] }
        for (let item of options.order.fields) {
          let direction = (item.isDesc === true)? 'desc' : 'asc';
          if (isFirst) {
            filterQuery += ` ${item.field} ${direction}`;
            isFirst = false;
          } else {
            filterQuery += `, ${item.field} ${direction}`;
          }
        }
      }
    }
    if (options.limit >= 1) {
      filterQuery += ` LIMIT $${i++}`;
      filterParams.push(options.limit);
    }
    if (options.offset >= 0) {
      filterQuery += ` OFFSET $${i++}`;
      filterParams.push(options.offset);
    }
    if (options.lockForUpdate) {
      filterQuery += ' FOR UPDATE';
    }
    let selectableCols;
    if (options && options.selectableCols && options.selectableCols.constructor === Array) {
      selectableCols = options.selectableCols.join(',');
    } 
    filterQuery = format(filterQuery, selectableCols, tableName);
    
    if (options.partition) {
      let partitionQuery = ` Partition by ${options.partition.field}`
      if (options.partition.order) {
        partitionQuery += ` Order by ${options.partition.order.field}`
        if (options.partition.order.isDesc === true)
          partitionQuery += ' desc'
        else {
          partitionQuery += ' asc'
        }
      }
      if(options.partition.limit) {
        tableName = '(select *, row_number() over (' + partitionQuery + ')as rownum from (' + filterQuery + ') as tmp ) as tmp1';
        filterQuery = format(partitionFilterQuery, selectableCols, tableName);
        filterQuery += `rownum <= $${i++}`
        filterParams.push(options.partition.limit);
      }
    }
    filterQuery += ';'
    return {
      text: filterQuery,
      values: filterParams
    };
  }

  filter(options) {
    return this.dbFilter(this.pgp, options);
  }

  dbFilter (db, options) {
    const me = this;
    var startTime = (new Date()).getTime();
    return co(function * () {
      let command = `Select * from radis where `;
      let i =1;
      let values = [];
      if(options.category1) {
        command +=  `data->>'category1'=$${i++}`
        values.push(options.category1);
      }
      if(options.category2) {
        command +=  options.category1 ? ` and data->>'category2'=$${i++}` : `data->>'category2'=$${i++}`
        values.push(options.category2);
      }
      if(options.category3) {
        command +=  options.category2 || options.category1 ? ` and data->>'category3'=$${i++}` : `data->>'category3'=$${i++}`;
        values.push(options.category3);
      }
      let entities = yield db.any(command, values);
     let result = _.map(entities, function(entity) {
        entity.data.created_date = entity.created_date;
        entity.data.modified_date = entity.modified_date;
        entity.data.id = entity.id;
        return entity.data;
      })
      return result;
    }).catch((e) => {
      me.handleError(e);
    });
  }

  _serializeValue(value) {
    return JSON.stringify(_.omit(value, ['created_date', 'modified_date', 'id']));
  }

  insert(id, value, options) {
      return this.dbInsert(this.pgp, id, value, options);
  }

  dbInsert (db, id, value, options) {
    const me = this;
    var startTime = (new Date()).getTime();
      return co(function * () {
        let currentTime = new Date();
        let command = `INSERT INTO radis (id, data, created_date, modified_date) VALUES ($${1},$${2},$${3},$${4})`;
        let obj = me._serializeValue(value)
        let date = currentTime.toISOString();
        let input  = [
          id,
          obj,
          date,
          date
        ]
        let result = yield db.any(command, input);
        var timeTaken = (new Date()).getTime() - startTime;
        return result;
      }).catch((e) => {
        me.handleError(e);
      });
  }
}

module.exports = PGModel;
