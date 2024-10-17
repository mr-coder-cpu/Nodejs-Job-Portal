import jobModels from "../model/jobModels.js"
import mongoose from "mongoose"
import moment from 'moment'

// create job
export const createJobController = async (req, res, next) => {

  const { company, position } = req.body

  if (!company || !position) {
    next('please provide all field')
  }

  req.body.createdBy = req.user.userId
  const job = await jobModels.create(req.body)
  res.status(201).json({ job })
}

// GET JOB
export const getAllJobsController = async (req, res, next) => {
  const { status, workType, search, sort } = req.query

  //condtion for searching filter
  const queryObject = {
    createdBy: req.user.userId
  }
  //logic filter
  if (status && status !== 'all') {
    queryObject.status = status
  }

  if (workType && workType != 'all') {
    queryObject.workType = workType
  }
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' }
  }
  let queryResult = jobModels.find(queryObject)

  //Sorting
  if (sort === 'latest') {
    queryResult = queryResult.sort('-createdAt')
  }


  if (sort === 'oldest') {
    queryResult = queryResult.sort('createdAt')
  }


  if (sort === 'a-z') {
    queryResult = queryResult.sort('position')
  }


  if (sort === 'z-a') {
    queryResult = queryResult.sort('-position')
  }

  // pagination 
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  queryResult = queryResult.skip(skip).limit(limit)

  // jobs count
  const totalJobs = await jobModels.countDocuments(queryResult)
  const numOfPage = Math.ceil(totalJobs / limit)

  const jobs = await queryResult;

  // const jobs = await jobModels.find({ createdBy: req.user.userId })
  res.status(200).json({
    totalJobs,
    jobs,
    numOfPage
  })
}

//   UPDATE JOBS

export const updateJobController = async (req, res, next) => {

  const { id } = req.params;
  const { company, position } = req.body
  //validation
  if (!company || !position) {
    next('Please Provide All Field ')
  }
  //find job

  const job = await jobModels.findOne({ _id: id })
  //validation
  if (!job) {
    next(`no jobs found with this id ${id}`)
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next('You are not authorized to update this job');
    return;
  }

  const updateJob = await jobModels.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ updateJob });

};

// DELETE JOB
export const deleteJobController = async (req, res, next) => {

  const { id } = req.params;

  //find job
  const job = await jobModels.findOne({ _id: id })

  //validation

  if (!job) {
    next(`No Job Found With This ${id}`)
  }

  if (!req.user.userId === job.createdBy.toString()) {
    next("You Are Not Authorized To Delete This Job");
    return;
  }

  await job.deleteOne();
  res.status(200).json({ message: 'Success,Job Deleted!' });

}

// JOB STATS & FILTER
export const jobStatsController = async (req, res, next) => {

  const stats = await jobModels.aggregate([
    //search By Usser
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId)
      }

    },
    {
      $group: {
        _id: '$status', count: { $sum: 1 },
      },
    },
  ]);

  //default stats
  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0
  };

  // monthly yearly stats
  let monthlyAplication = await jobModels.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId)
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: {
          $sum: 1,
        },

      }
    }

  ])
  monthlyAplication = monthlyAplication.map((item) => {
    const { _id: { year, month }, count } = item
    const date = moment().month(month - 1).year(year).format('MMM Y')
    return { date, count }
  }).reverse();
  res.status(200).json({ totaljob: stats.length, defaultStats, monthlyAplication })
}