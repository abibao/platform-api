const chai = require('chai')
const expect = chai.expect

const uuid = require('../../server/services/globalHooks').uuid()
const urn = require('../../server/services/globalHooks').urn()

describe('[unit] global hooks', function () {
  it('should not create uuid because id is present', (done) => {
    let result = uuid({
      data: {id: '000000'}
    })
    expect(result.data).to.have.property('id').and.equal('000000')
    done()
  })
  it('should create uuid because id is not present', (done) => {
    let result = uuid({
      data: {}
    })
    expect(result.data).to.have.property('id')
    done()
  })
  it('should create an urn', (done) => {
    let result = urn({
      data: {}
    })
    expect(result.data).to.have.property('urn')
    done()
  })
})
