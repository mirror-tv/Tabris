'use client'
import LazyRenderWrapper from '../shared/lazy-render-wrapper'
import useWindowDimensions from '~/hooks/use-window-dimensions'

const AdAfterStory = () => {
  const { width } = useWindowDimensions()

  return (
    <LazyRenderWrapper>
      <div
        id="dablewidget_2Xnxwk7d_xXAWmB7G"
        data-widget_id-pc="2Xnxwk7d"
        data-widget_id-mo="xXAWmB7G"
        className="dable-widget-last"
      />
      {width && width >= 768 && (
        <div id="_popIn_recommend" className="popin_recommend" />
      )}
    </LazyRenderWrapper>
  )
}

export default AdAfterStory
