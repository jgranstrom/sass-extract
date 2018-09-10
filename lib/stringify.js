'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
Copyright (c) 2016, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var type = {
  arguments: function _arguments(n) {
    return '(' + walkValue(n.content) + ')';
  },
  atkeyword: function atkeyword(n) {
    return '@' + n.content;
  },
  attribute: function attribute(n) {
    return '[' + walkValue(n.content) + ']';
  },
  block: function block(n) {
    return '{' + walkValue(n.content) + '}';
  },
  class: function _class(n) {
    return '.' + walkValue(n.content);
  },
  color: function color(n) {
    return '#' + n.content;
  },
  id: function id(n) {
    return '#' + walkValue(n.content);
  },
  interpolation: function interpolation(n) {
    return '#{' + walkValue(n.content) + '}';
  },
  comment_multiline: function comment_multiline(n) {
    return '/*' + n.content + '*/';
  },
  comment_singleline: function comment_singleline(n) {
    return '//' + n.content;
  },
  parentheses: function parentheses(n) {
    return '(' + walkValue(n.content) + ')';
  },
  pseudo_class: function pseudo_class(n) {
    return ':' + walkValue(n.content);
  },
  psuedo_element: function psuedo_element(n) {
    return '::' + walkValue(n.content);
  },
  string: function string(n) {
    return '' + n.content;
  },
  variable: function variable(n) {
    return '$' + walkValue(n.content);
  }
};

var walkNode = function walkNode(node) {
  if (type[node.type]) return type[node.type](node);
  if (typeof node.content === 'string') return node.content;
  if (Array.isArray(node.content)) return walkValue(node.content);
  return '';
};

var walkValue = function walkValue(value) {
  if (!Array.isArray(value)) return '';
  return value.reduce(function (s, node) {
    return s + walkNode(node);
  }, '');
};

var stringify = exports.stringify = walkNode;