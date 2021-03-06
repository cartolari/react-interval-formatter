import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import sinon from 'sinon'

import FormatterEmitter from 'FormatterEmitter'
import IntervalFormatter from 'IntervalFormatter'

describe('IntervalFormatter', () => {
  it('renders the formatted value', () => {
    const formatter = sinon.stub()
      .withArgs('value')
      .returns('really formatted')

    const wrapper = mount(<IntervalFormatter value='value' formatter={formatter} />)
    expect(wrapper).to.have.html('<span data-reactroot="">really formatted</span>')
  })

  it('renders the formatted value', () => {
    const formatter = sinon.stub()
      .withArgs('value')
      .returns('really formatted')

    const wrapper = mount(<IntervalFormatter value='value' formatter={formatter} />)
    expect(wrapper).to.have.html('<span data-reactroot="">really formatted</span>')
  })

  it('calls the unsubscriber from IntervalFormatter.register on unmount', () => {
    const formatter = sinon.stub()

    const unsubscriber = sinon.spy()

    const registerStub = sinon.stub(FormatterEmitter, 'register')
    registerStub
      .withArgs({
        value: 'value',
        formatter,
        callback: sinon.match.func
      })
      .returns(unsubscriber)

    const wrapper = mount(<IntervalFormatter value='value' formatter={formatter} />)
    wrapper.unmount()
    sinon.assert.calledOnce(unsubscriber)
    FormatterEmitter.register.restore()
  })

  it('renders other props', () => {
    const formatter = sinon.stub()
      .withArgs('the value')
      .returns('the formatted value')

    const callback = sinon.spy()

    const wrapper = mount(
      <IntervalFormatter
        tag='div'
        value='the value'
        onClick={callback}
        className='className'
        formatter={formatter} />
    )

    wrapper.simulate('click')
    expect(callback.calledOnce).to.be.true

    expect(wrapper).to.have.html('<div data-reactroot="" class="className">the formatted value</div>')
  })

  it('unsubscribes and register new subscriber on update', () => {
    const formatter = sinon.stub()
      .withArgs('value2')
      .returns('formatted2')
    const unsubscriber = sinon.spy()

    const registerStub = sinon.stub(FormatterEmitter, 'register')
    registerStub
      .withArgs({
        value: 'value',
        formatter,
        callback: sinon.match.func
      })
      .returns(unsubscriber)

    const wrapper = mount(<IntervalFormatter value='value' formatter={formatter} />)
    const oldSubscriber = wrapper.getNode().unsubscriber
    wrapper.setProps({
      value: 'newValue'
    })
    const newSubscriber = wrapper.getNode().unsubscriber

    expect(oldSubscriber).to.not.equal(newSubscriber)

    expect(wrapper).to.have.state('formattedValue', 'formatted2')
    sinon.assert.calledOnce(unsubscriber)
    FormatterEmitter.register.restore()
  })
})
