import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
    Row,
    Col,
    Icon,
    Card,
    DatePicker,
} from 'antd';
import numeral from 'numeral';
import {
    ChartCard,
    TimelineChart
} from '../../components/Charts';
import Trend from '../../components/Trend';
import NumberInfo from '../../components/NumberInfo';
import { getTimeDistance } from '../../utils/utils';
import { queryWx } from '../../services/finance'
import moment from 'moment'
import styles from './wx.less';

const { RangePicker } = DatePicker;
const format = 'YYYY-MM-DD HH:mm:ss'
function disabledDate(current) {
    // Can not select days before today and today
    return current > moment().endOf('day');
}
export default class FinanceWx extends Component {
    state = {
        loading: 0,
        topData: {
            total: 0,
            today: 0,
            yesterday: 0,
            week: 0,
            lastWeek: 0,
            month: 0,
            lastMonth: 0,
            year: 0,
            lastYear: 0
        },
        rangePickerValue: getTimeDistance('month'),
        days: []
    };
    componentWillMount() {
        this.queryTop();
        this.queryDate(this.state.rangePickerValue)
    }
    queryTop() {
        queryWx().then(data => {
            if (data.error.ErrorCode != 0) return;
            const { day, week, month, year, total } = data
            const today = day[0] ? day[0].Sum : 0;
            const yesterday = day[1] ? day[1].Sum : 0;
            const nowWeek = week[0] ? week[0].Sum : 0;
            const lastWeek = week[1] ? week[1].Sum : 0;
            const nowMonth = month[0] ? month[0].Sum : 0;
            const lastMonth = month[1] ? month[1].Sum : 0;
            const nowYear = year[0] ? year[0].Sum : 0;
            const lastYear = year[1] ? year[1].Sum : 0;
            const topData = {
                total,
                today,
                yesterday,
                week: nowWeek,
                month: nowMonth,
                year: nowYear,
                lastWeek,
                lastMonth,
                lastYear
            }
            for (let i in topData) {
                topData[i] = topData[i] / 100
            }
            this.setState({
                ...this.state,
                topData: { ...topData }
            })

        })
    }

    handleRangePickerChange = (rangePickerValue) => {
        this.setState({
            rangePickerValue,
        });
        this.queryDate(rangePickerValue)
    };

    selectDate = (type) => {
        this.setState({
            rangePickerValue: getTimeDistance(type),
        });
        this.queryDate(getTimeDistance(type))
    };
    queryDate(rangePickerValue) {
        const start_time = rangePickerValue[0].format(format);
        const end_time = rangePickerValue[1].format(format);
        queryWx({ start_time, end_time }).then(data => {
            if (data.error.ErrorCode != 0) return;
            this.setState({
                days: data.day
            })
        })
    }

    isActive(type) {
        const { rangePickerValue } = this.state;
        const value = getTimeDistance(type);
        if (!rangePickerValue[0] || !rangePickerValue[1]) {
            return;
        }
        if (
            rangePickerValue[0].isSame(value[0], 'day') &&
            rangePickerValue[1].isSame(value[1], 'day')
        ) {
            return styles.currentDate;
        }
    }


    render() {
        const { rangePickerValue, topData, days } = this.state;
        const { chart, loading } = this.props;
        const salesExtra = (
            <div className={styles.salesExtraWrap}>
                <div className={styles.salesExtra}>
                    <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>本周</a>
                    <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>本月</a>
                    <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>本年</a>
                </div>
                <RangePicker
                    value={rangePickerValue}
                    disabledDate={disabledDate}
                    onChange={this.handleRangePickerChange}
                    style={{ width: 256 }}
                />
            </div>
        );
        const topColResponsiveProps = {
            xs: 24,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 6,
            style: { marginBottom: 24 },
        };
        const { total, today, yesterday, week, lastWeek, month, lastMonth, year, lastYear } = topData;
        return (
            <Fragment>
                <Row gutter={24}>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                            bordered={false}
                            title="总销售额"
                            total={`￥${numeral(total).format('0,0.00')}`}
                            footer={
                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                    <Trend style={{ marginRight: 16 }}>
                                        今天销售额<span className={styles.trendText}>{`￥${numeral(today).format('0,0.00')}`}</span>
                                    </Trend>
                                    <Trend flag={today - yesterday >= 0 ? "up" : "down"} style={{ marginRight: 16 }}>
                                        相比昨天<span className={styles.trendText}>{`￥${numeral(today - yesterday).format('0,0.00')}`}</span>
                                    </Trend>
                                </div>
                            }
                            contentHeight={46}
                        >
                        </ChartCard>
                    </Col>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                            bordered={false}
                            title="本周销售额"
                            total={`￥${numeral(week).format('0,0.00')}`}
                            footer={
                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                    <Trend flag={week - lastWeek >= 0 ? "up" : "down"} style={{ marginRight: 16 }}>
                                        相比上周<span className={styles.trendText}>{`￥${numeral(week - lastWeek).format('0,0')}`}</span>
                                    </Trend>
                                </div>
                            }
                            contentHeight={46}
                        >
                        </ChartCard>
                    </Col>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                            bordered={false}
                            title="本月销售额"
                            total={`￥${numeral(month).format('0,0.00')}`}
                            footer={
                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                    <Trend flag={month - lastMonth >= 0 ? "up" : "down"} style={{ marginRight: 16 }}>
                                        相比上月<span className={styles.trendText}>{`￥${numeral(month - lastMonth).format('0,0')}`}</span>
                                    </Trend>
                                </div>
                            }
                            contentHeight={46}
                        >
                        </ChartCard>
                    </Col>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                            bordered={false}
                            title="本年销售额"
                            total={`￥${numeral(year).format('0,0.00')}`}
                            footer={
                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                    <Trend flag={year - lastYear >= 0 ? "up" : "down"} style={{ marginRight: 16 }}>
                                        相比去年<span className={styles.trendText}>{`￥${numeral(year - lastYear).format('0,0')}`}</span>
                                    </Trend>
                                </div>
                            }
                            contentHeight={46}
                        >
                        </ChartCard>
                    </Col>
                </Row>
                <Card
                    loading={loading}
                    className={styles.offlineCard}
                    bordered={false}
                    bodyStyle={{ padding: '0 0 32px 0' }}
                    style={{ marginTop: 32 }}
                    title='销售额分析'
                    extra={salesExtra}
                >
                    <div style={{ padding: '0 24px' }}>
                        <TimelineChart
                            height={400}
                            data={filter(days)}
                            titleMap={{ y1: '销售额' }}
                        />
                    </div>
                </Card>
            </Fragment>
        );
    }
}
function filter(day) {
    const data = [];
    if (day.length <= 0) return [
        {
            x: 0,
            y1: 0,
            y2: 0,
        },
    ]
    for (let item of day) {

        data.push({
            x: new Date(item.Keys).getTime(),
            y1: item.Sum / 100,
        })
    }
    return data;
}