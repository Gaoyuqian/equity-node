var iconv = require('iconv-lite')
const https = require('https')
const http = require('http')
const rq = require('request-promise')
const request = require('request')
const fs = require('fs')
const express = require('express')
const cheerio = require('cheerio')
const app = express()
const tough = require('tough-cookie')
module.exports = { iconv, https, http, rq, request, app, fs, cheerio, tough }
